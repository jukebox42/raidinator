import { useState, useEffect, useMemo, useRef, useContext } from "react";
import {
  Stack,
  Typography,
} from "@mui/material";

import db, { ManifestTables } from "../store/db";
import { LANGUAGE } from "../utils/constants";
import { getManifest, getManifestContent } from "../bungie/api";
import { AppContext } from "../context/AppContext";
import CharacterContextProvider from "../context/CharacterContext";

// Components
import FindPlayer from "../components/FindPlayer";
import Character from "../components/Character";
import { FireteamDialog } from "../components/partials"
import { Loading, NavBar, ErrorBoundary } from "../components/generics";

// Interfaces
import * as BI from "../bungie/interfaces";
import { PlayerData } from "../utils/interfaces";

function CharacterList() {
  const context = useContext(AppContext);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const refreshCount = useRef(0);
  const [loading, setLoading] = useState(true);
  const [playerCacheLoaded, setPlayerCacheLoaded] = useState(false)
  const [fireteamDialogOpen, setFireteamDialogOpen] = useState(false);
  const [fireteamDialogPlayer, setFreteamDialogPlayer] = useState<PlayerData | null>(null);

  /**
   * Handle refreshing the app. purges all cached guardian data but NOT player data and character
   * selections per player.
   */
  const refreshCallback = () => {
    setRefreshing(true);
    context.refresh();
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

    if(!loading && !refreshing) {
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
          return setLoading(false);
        }

        // Load manifest data
        console.log("Loading manifest from", savedVersion, "to", liveVersion, "...");
        const manifestPath = response.jsonWorldContentPaths[LANGUAGE];
        await writeManifests(manifestPath);
        await db.AppManifestVersion.put(liveVersion, 1);
        console.log("Manifest loaded.")
        return setLoading(false);
      } catch (e) {
        console.error("ERROR", e);
        setError("Failed to load Manifest.");
      }
    });
  }, []);

  // Effect to load players from cache
  useEffect(() => {
    if(loading) {
      return;
    }

    console.log("Loading Players from DB...");
    db.AppPlayers.toArray().then(dbPlayers => {
      console.log("DB Players loaded", dbPlayers);
      if (dbPlayers.length) {
        const cards = dbPlayers.map(p => { return { membershipId: p.membershipId, player: p, refresh: false } });
        context.replaceCards(cards);
      }
      setTimeout(() => setPlayerCacheLoaded(true), 0);
    });
  }, [loading]);

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
   * Handle the refresh event. keep track of how many got refreshed so we know when we are done.
   */
  const onRefreshed = (membershipId: number) => {
    refreshCount.current++;
    console.log("REFRESHED", membershipId, refreshCount.current);
    if (refreshCount.current >= context.cards.length) {
      setRefreshing(false);
      refreshCount.current = 0;
    }
  };

  if (error) {
    return (
      <>
        <NavBar refreshCallback={refreshCallback} acting={true}/>
        <Typography variant="body1" sx={{ color: "white" }}>{error}</Typography>
      </>
    );
  }

  // if not loaded show spinner
  if (loading || !playerCacheLoaded) {
    const loadingText = refreshing ? "Refreshing..." : "Loading manifest...";
    return (
      <>
        <NavBar refreshCallback={refreshCallback} acting={true}/>
        <Loading marginTop="150px" loadingText={loadingText} />
      </>
    );
  }

  const membershipIds = context.cards.map(c => c.membershipId.toString());

  return (
    <>
        <NavBar refreshCallback={refreshCallback} acting={loading || refreshing}/>
        <ErrorBoundary>
        <Stack sx={{ mx: "auto", pt: "56px", pb: "65px" }}>
          {context.cards.map(card => {
            return (
              <CharacterContextProvider key={card.membershipId} membershipId={card.membershipId} membershipType={card.player.membershipType}>
                <Character
                  player={card.player}
                  lastRefresh={context.lastRefresh}
                  onRefreshed={onRefreshed}
                  onLoadFireteam={loadFireteam}/>
              </CharacterContextProvider>
            );
          })}
        </Stack>
        </ErrorBoundary>
        {context.cards.length < 6 && <FindPlayer onFoundPlayer={foundPlayer} memberIds={membershipIds} />}
        <FireteamDialog
          player={fireteamDialogPlayer}
          onClose={() => setFireteamDialogOpen(false)}
          open={fireteamDialogOpen} />
    </>
  );
}

export default CharacterList;
