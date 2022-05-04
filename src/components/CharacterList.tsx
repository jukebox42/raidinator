// TODO: break up this file it's too big
import { useState, useEffect, useMemo, useRef, useContext } from "react";
import { Stack, Typography } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

import db, { ManifestTables } from "store/db";
import { LANGUAGE } from "utils/constants";
import { getManifestContent } from "bungie/api";
import { getManifest } from "store/api";
import { AppContext } from "context/AppContext";
import CharacterContextProvider from "context/CharacterContext";

// Components
import FindPlayer from "components/FindPlayer";
import Character from "components/Character";
import Intro from "components/Intro";
import { FireteamDialog } from "components/partials"
import { Loading, NavBar, ErrorBoundary } from "components/generics";

// Interfaces
import * as BI from "bungie/interfaces";
import { PlayerData } from "utils/interfaces";

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
   * Writes the manifest tables on a full refresh
   */
   const writeManifests = (manifestPath: string) => {
    const tableNames = db.tables.map(t => t.name);

    return getManifestContent(manifestPath).then(manifestResponse => {
      const promises = Object.keys(manifestResponse).map(table => {
        // Only write the manifest tables we care about. I'm sure I'll regret this when I need one I didn't write.
        if (!tableNames.find(n => n === table)) {
          return Promise.resolve();
        }
        const dbkeys = Object.keys(manifestResponse[table]);
        const dbvalues: any = Object.keys(manifestResponse[table]).map(
          oskey => manifestResponse[table][oskey]);
        return (db[table as ManifestTables] as any).bulkPut(dbvalues, dbkeys).catch(
          (e: any) => console.error("Db Write failed:", table, e));
      });
      return Promise.allSettled(promises);
    });
  }

  type ManifestValue = { data: BI.Destiny.Config.DestinyManifest, error: any };

  const handleManifestLoad = async (force = false) => {
    // See if we need to load the manifest data and do it
    await loadManifest(async ({ data, error }: ManifestValue) => {
      // If error then show the error.
      if (error.errorCode !== 1) {
        setError(error.message);
        context.addToast(error.errorStatus);
        return;
      }

      try {
        await db.init();

        await context.loadAppSettings();

        // Check manifest version
        const liveVersion = data.version;
        const savedVersion = await db.AppManifestVersion.get(1);
        if (!force && liveVersion === savedVersion) {
          console.log("Manifest already up to date", liveVersion);
          return setLoading(false);
        }

        // Load manifest data
        console.log("Loading manifest from", savedVersion, "to", liveVersion, "...");
        const manifestPath = data.jsonWorldContentPaths[LANGUAGE];
        await writeManifests(manifestPath);
        await db.AppManifestVersion.put(liveVersion, 1);
        console.log("Manifest loaded.");
        return setLoading(false);
      } catch (e) {
        console.error("ERROR", e);
        const error = "Failed to load manifest.";
        context.addToast(error);
        setError(error);
      }
    });
  }

  const loadManifest = useMemo(() =>
    (
      callback: ({ data, error }: ManifestValue) => Promise<void>,
    ) => getManifest().then(callback),
    []
  );

  // Effect to load manifest on refresh
  useEffect(() => {
    if(!loading && !refreshing) {
      return;
    }

    handleManifestLoad();
  }, []);

  // Effect to load players from cache
  useEffect(() => {
    if(loading) {
      return;
    }

    db.AppPlayers.toArray().then(dbPlayers => {
      if (dbPlayers.length) {
        const cards = dbPlayers.map(p => ({ membershipId: p.membershipId, player: p, refresh: false }));
        context.replaceCards(cards);
      }
      setTimeout(() => setPlayerCacheLoaded(true), 0);
    });
  }, [loading]);

  // Forces scroll to the bottom of the character list div so new players are visible when added
  useEffect(() => {
    const charactersWrapper = document.querySelector("#root>.MuiBox-root");
    if (charactersWrapper) {
      charactersWrapper.scrollTop = charactersWrapper.scrollHeight;
    }
  }, [context.cards]);

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
    setFreteamDialogPlayer(player);
    setFireteamDialogOpen(true);
  }

    /**
   * Handle reloading the manifest
   */
     const reloadManifestCallback = async () => {
      setRefreshing(true); // this gets disabled in the refresh callback
      await handleManifestLoad(true);
      refreshCallback();
    }

  /**
   * Handle refreshing the app. purges all cached guardian data but NOT player data and character
   * selections per player.
   */
  const refreshCallback = () => {
    if (context.cards.length  === 0) {
      setRefreshing(false);
      return;
    }
    setRefreshing(true);
    context.refresh();
  }

  /**
   * Handle the refresh event. keep track of how many got refreshed so we know when we are done.
   */
  const onRefreshed = () => {
    refreshCount.current++;
    if (refreshCount.current >= context.cards.length) {
      setRefreshing(false);
      refreshCount.current = 0;
    }
  };

  if (error) {
    return (
      <>
        <NavBar acting={true} refreshCallback={refreshCallback} reloadManifestCallback={reloadManifestCallback} />
        <Typography variant="body1" sx={{ textAlign: "center", mt: "150px" }}>
          <ErrorOutlineIcon sx={{fontSize: 60}} />
        </Typography>
        <Typography variant="body1" sx={{ textAlign: "center", color: "white" }}>{error}</Typography>
      </>
    );
  }

  // if not loaded show spinner
  if (loading || !playerCacheLoaded) {
    const loadingText = refreshing ? "Refreshing..." : "Loading Destiny Database...";
    return (
      <>
        <NavBar acting={true} refreshCallback={refreshCallback} reloadManifestCallback={reloadManifestCallback}/>
        <Loading marginTop="150px" loadingText={loadingText} />
      </>
    );
  }

  const membershipIds = context.cards.map(c => c.membershipId.toString());

  return (
    <>
        <NavBar
          acting={loading || refreshing}
          refreshCallback={refreshCallback}
          reloadManifestCallback={reloadManifestCallback}
        />
        <ErrorBoundary>
        <Stack sx={{ mx: "auto", pt: "57px", pb: "65px" }}>
          {context.cards.map(card => (
            <CharacterContextProvider
              key={card.membershipId}
              membershipId={card.membershipId}
              membershipType={card.player.membershipType}
            >
              <Character
                player={card.player}
                lastRefresh={context.lastRefresh}
                onRefreshed={onRefreshed}
                onLoadFireteam={loadFireteam}/>
            </CharacterContextProvider>
          ))}
        </Stack>
        </ErrorBoundary>
        {context.cards.length === 0 && <Intro />}
        {context.cards.length < 6 && <FindPlayer onFoundPlayer={foundPlayer} memberIds={membershipIds} />}
        <FireteamDialog
          player={fireteamDialogPlayer}
          onClose={() => setFireteamDialogOpen(false)}
          open={fireteamDialogOpen} />
    </>
  );
}

export default CharacterList;
