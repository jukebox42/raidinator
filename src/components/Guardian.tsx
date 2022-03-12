import { useState, useEffect } from "react";
import {
  Box,
  CardContent,
} from "@mui/material";

import db from "../store/db";

// Components
import { Loading, TouchCard } from "./generics";
import { PickGuardian, DisplayGuardian } from "./guardianViews";

// Interfaces
import { PlayerData, GuardianData } from "../utils/interfaces";
import * as BI from "../bungie/interfaces";

interface GuardianProps {
  playerId?: string;
  cardKey: string;
  onDelete: (key: string) => void;
  onLoadFireteam: (player: PlayerData) => void;
}

const Guardian = ( { playerId, cardKey, onDelete, onLoadFireteam }: GuardianProps ) => {
  const [player, setPlayer] = useState<PlayerData | null>(null);
  const [guardian, setGuardian] = useState<GuardianData | null>(null);
  const [loadedCachedPlayer, setLoadedCachedPlayer] = useState(false);
  const [cachedGuardianId, setCachedGuardianId] = useState("");
  const [loading, setLoading] = useState(false);

  // TODO: This causes a memory leak, something to do with the loaded player
  useEffect(() => {
    let active = true;

    if (!playerId || playerId === "0") {
      setLoadedCachedPlayer(true);
      return () => {
        active = false;
      }
    }

    setLoading(true);
    db.AppPlayers.get(playerId).then(cachedPlayer => {
      if (cachedPlayer) {
        setPlayer(cachedPlayer);
        return db.AppPlayersSelectedCharacter.get(playerId).then(characterId => {
          if (characterId) {
            console.log("Loaded CharacterId from DB", characterId);
            setCachedGuardianId(characterId.toString());
          } else {
            console.log("Did NOT load CharacterId from DB", characterId);
          }
          setLoadedCachedPlayer(true);
        });
      } else {
        setLoadedCachedPlayer(true);
      }

      return Promise.resolve();
    });

    return () => {
      active = false;
    }
  }, []);

  useEffect(() => {
    let active = true;
    if (!loadedCachedPlayer) {
      return () => {
        active = false;
      }
    }

    setLoading(false);
    return () => {
      active = false;
    }
  }, [loadedCachedPlayer]);

  const pickedGuardian = (
      character: BI.Destiny.Entities.Characters.DestinyCharacterComponent,
      inventory: BI.Destiny.Entities.Inventory.DestinyInventoryComponent,
      itemComponents: BI.Destiny.Entities.Items.DestinyItemComponentSet,
      characterPlugSets: BI.Destiny.Components.PlugSets.DestinyPlugSetsComponent,
    ) => setGuardian({character, inventory, itemComponents, characterPlugSets});

  const changeCharacter = () => {
    setGuardian(null);
    setCachedGuardianId("");
  }

  return (
    <TouchCard
      className="guardianCard"
      sx={{m: 1, mb: 0, p: 0, background: "rgb(16 19 28 / 0.65)" }}
      onDelete={() => onDelete(cardKey)}
    >
      <CardContent sx={{ p: 0, pb: "0px !important" }}>
        {loading && <Box sx={{ p: 0 }}><Loading marginTop="48px" /></Box>}
        {!loading && player && !guardian && loadedCachedPlayer &&
          <PickGuardian
            player={player}
            guardianId={cachedGuardianId}
            pickedGuardian={pickedGuardian}
          />}
        {!loading && player && guardian && guardian.character.light &&
          <DisplayGuardian
            player={player}
            guardian={guardian}
            onLoadFireteam={() => onLoadFireteam(player)}
            onChangeCharacter={changeCharacter}
          />}
      </CardContent>
    </TouchCard>
  );
}

export default Guardian;