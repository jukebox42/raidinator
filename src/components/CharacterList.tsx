import { useState, useEffect, useMemo, useContext } from "react";
import {
  Fab,
  Stack,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import clone from "lodash/clone";

import db, { ManifestTables } from "../store/db";
import { LANGUAGE } from "../utils/constants";
import { getManifest, getManifestContent } from "../bungie/api";
import { CharacterContext } from "../context/CharacterContext";

// Components
import FindPlayer from "../components/FindPlayer";
import Character from "../components/Character";
import { FireteamDialog } from "../components/partials"
import { Loading, NavBar, ErrorBoundary } from "../components/generics";

// TODO: Rename
import { IAppContext } from "../store/AppContext";

// Interfaces
import * as BI from "../bungie/interfaces";
import { PlayerData } from "../utils/interfaces";

function CharacterList() {
  const context = useContext(CharacterContext);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [playerCacheLoaded, setPlayerCacheLoaded] = useState(false)
  const [fireteamDialogOpen, setFireteamDialogOpen] = useState(false);
  const [fireteamDialogPlayer, setFreteamDialogPlayer] = useState<PlayerData | null>(null);

  /**
   * Handle refreshing the app. purges all cached guardian data but NOT player data and character
   * selections per player.
   */
  const refreshCallback = async (refresh: () => Promise<void>) => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  }

  /**
   * Writes the manifest tables on a full refresh
   */
   const writeManifests = (manifestPath: string) => {
    return getManifestContent(manifestPath).then(manifestResponse => {
      const promises = Object.keys(manifestResponse).map((table: any) => {
        const dbkeys = Object.keys(manifestResponse[table]);
        const dbvalues: any = Object.keys(manifestResponse[table]).map(
          (oskey: any) => manifestResponse[table][oskey]);
        console.log("Writing Table...");
        return (db[table as ManifestTables] as any).bulkPut(dbvalues, dbkeys).catch(
          (e: any) => console.error("Db Write failed:", table, e));
      });
      return Promise.allSettled(promises);
    });
  }

  const loadManifest = useMemo(() =>
    (
      callback: (response: BI.Destiny.Config.DestinyManifest) => void,
    ) => getManifest().then(callback),
    []
  );

  // Effect to load manifest on refresh
  useEffect(() => {
    let active = true;

    if(loaded && !refreshing) {
      console.log("App Loaded.");
      return;
    }

    // See if we need to load the manifest data and do it
    loadManifest(async response => {
      if (!active) {
        return;
      }

      try {
        await db.init();

        // Check manifest version
        const liveVersion = response.version;
        const savedVersion = await db.AppManifestVersion.get(1);
        if (liveVersion === savedVersion) {
          console.log("Manifest already up to date", liveVersion);
          return setLoaded(true);
        }

        // Load manifest data
        console.log("Loading manifest from", savedVersion, "to", liveVersion, "...");
        const manifestPath = response.jsonWorldContentPaths[LANGUAGE];
        await writeManifests(manifestPath);
        await db.AppManifestVersion.put(liveVersion, 1);
        console.log("Manifest loaded.")
        return setLoaded(true);
      } catch (e) {
        console.error("ERROR", e);
        setError("Failed to load Manifest.");
      }
    });
  }, []);

  // Effect to load players from cache
  useEffect(() => {
    if(!loaded) {
      return;
    }

    console.log("Loading Players from DB...");
    db.AppPlayers.toArray().then(dbPlayers => {
      console.log("DB Players loaded", dbPlayers);
      if (dbPlayers.length) {
        const cards = dbPlayers.map(p => { return { membershipId: p.membershipId, player: p } });
        console.log("CARDS TO REPLACE", cards);
        context.replaceCards(cards);
      }
      setPlayerCacheLoaded(true);
    });
  }, [loaded]);

  /**
   * Create a new character card
   */
  const foundPlayer = async (player: PlayerData) => {
    await db.AppPlayers.put(player, player.membershipId); // store player in player database.
    context.addCard(player.membershipId, player);
  }

  /**
   * Handle showing the fireteam loader dialog
   */
  const loadFireteam = (player: PlayerData) => {
    console.log("Loading Fireteam", player);
    setFreteamDialogPlayer(player);
    setFireteamDialogOpen(true);
  }

  /**
   * Handle the on load fireteam even from the dialog
   */
  const onLoadFireteam = (fireteamPlayers: IAppContext[]) => {
    db.AppPlayersSelectedCharacter.clear().then(() => {
      console.log("FOUND PLAYERS", fireteamPlayers);
      //setGuardians(fireteamPlayers);
    });
  }

  if (error) {
    <>
      <NavBar refreshCallback={refreshCallback} acting={true}/>
      <Typography variant="body1" sx={{ color: "white" }}>{error}</Typography>
    </>
  }

  // if not loaded show spinner
  if ((!loaded && !playerCacheLoaded) || loaded && refreshing) {
    const loadingText = refreshing ? "Refreshing..." : "Loading manifest...";
    return (
      <>
        <NavBar refreshCallback={refreshCallback} acting={true}/>
        <Loading marginTop="150px" loadingText={loadingText} />
      </>
    );
  }

  return (
    <>
        <NavBar refreshCallback={refreshCallback} acting={!loaded || refreshing}/>
        <ErrorBoundary>
        <Stack sx={{ mx: "auto", pt: "56px", pb: "65px" }}>
          {context.cards.map(card => {
            return (
              <Character
                key={card.membershipId}
                membershipId={card.membershipId}
                characterId={card.characterId}
                data={card.data}
                onLoadFireteam={loadFireteam}/>);
          })}
        </Stack>
        </ErrorBoundary>
        {context.cards.length < 6 && <FindPlayer onFoundPlayer={foundPlayer} />}
        <FireteamDialog
          player={fireteamDialogPlayer}
          onClose={() => setFireteamDialogOpen(false)}
          open={fireteamDialogOpen}
          onLoadFireteam={(fireteamPlayers) => onLoadFireteam(fireteamPlayers)} />
    </>
  );
}

export default CharacterList;
