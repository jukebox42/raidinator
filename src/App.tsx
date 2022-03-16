import { useState, useEffect, useMemo } from "react";
import { v4 as uuid } from "uuid";
import {
  Fab,
  Stack,
  ThemeProvider,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import clone from "lodash/clone";

import db, { ManifestTables } from "./store/db";
import { LANGUAGE, theme } from "./utils/constants";
import { getManifest, getManifestContent } from "./bungie/api";

// Components
import FindPlayer from "./components/FindPlayer";
import Guardian from "./components/Guardian";
import { FireteamDialog } from "./components/partials"
import { Loading, NavBar, ErrorBoundary } from "./components/generics";

import { AppContext, IAppContext } from "./store/AppContext";

// Interfaces
import * as BI from "./bungie/interfaces";
import { PlayerData } from "./utils/interfaces";

function App() {
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [playerCacheLoaded, setPlayerCacheLoaded] = useState(false)
  const [guardians, setGuardians] = useState<IAppContext[]>([]);
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
        const ids = dbPlayers.map(p => { return {key: uuid(), id: p.membershipId.toString()} });
        setGuardians(ids);
      } else {
        setGuardians([{key: uuid()}]);
      }
      setPlayerCacheLoaded(true);
    });
  }, [loaded]);

  /**
   * Remove guardian card from the card list
   */
  const deleteGuardian = (key: string) => {
    const guardiansCopy = guardians.filter(g => {
      if (g.key === key && g.id) {
        db.deletePlayerCache(g.id);
      }
      return g.key !== key;
    });
    setGuardians(guardiansCopy);
  }

  /**
   * Replace a guardian in the list so it'll be rendered as a player
   */
  const foundPlayer = async (player: PlayerData, cardKey: string) => {
    await db.AppPlayers.put(player, player.membershipId); // store player in player database.
    const guardiansCopy = clone(guardians).map(g => {
      if (g.key === cardKey) {
        g.id = player.membershipId as any;
      }
      return g;
    });
    setGuardians(guardiansCopy);
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
      setGuardians(fireteamPlayers);
    });
  }

  if (error) {
    <ThemeProvider theme={theme}>
      <NavBar refreshCallback={refreshCallback} acting={true}/>
      <Typography variant="body1" sx={{ color: "white" }}>{error}</Typography>
    </ThemeProvider>
  }

  // if not loaded show spinner
  if ((!loaded && !playerCacheLoaded) || loaded && refreshing) {
    const loadingText = refreshing ? "Refreshing..." : "Loading manifest...";
    return (
      <ThemeProvider theme={theme}>
        <NavBar refreshCallback={refreshCallback} acting={true}/>
        <Loading marginTop="150px" loadingText={loadingText} />
      </ThemeProvider>
    );
  }

  const renderGuardian = (card: IAppContext) => {
    return (
      <Guardian
        key={card.key}
        playerId={card.id}
        cardKey={card.key}
        onDelete={deleteGuardian}
        onLoadFireteam={loadFireteam}/>);
  };

  const renderFindPlayer = (card: IAppContext) => {
    return (
      <FindPlayer
        key={card.key}
        cardKey={card.key}
        onDelete={deleteGuardian}
        onFoundPlayer={foundPlayer}/>);
  };

  return (
    <AppContext.Provider value={guardians}>
      <ThemeProvider theme={theme}>
        <NavBar refreshCallback={refreshCallback} acting={!loaded || refreshing}/>
        <ErrorBoundary>
        <Stack sx={{ mx: "auto", pt: "56px", pb: "50px" }}>
          {guardians.map((card) => {
            // either render a search box or a guardian card if there's a player id
            if (!card.id) {
              return renderFindPlayer(card);
            }
            return renderGuardian(card); 
          })}
        </Stack>
        </ErrorBoundary>
        {guardians.length < 6 && <Fab
          aria-label="add"
          size="small"
          className="fab-style"
          onClick={() => {setGuardians([...guardians, {key: uuid()}])}}>
            <AddIcon />
          </Fab>}
        <FireteamDialog
          player={fireteamDialogPlayer}
          onClose={() => setFireteamDialogOpen(false)}
          open={fireteamDialogOpen}
          onLoadFireteam={(fireteamPlayers) => onLoadFireteam(fireteamPlayers)} />
      </ThemeProvider>
    </AppContext.Provider>
  );
}

export default App;
