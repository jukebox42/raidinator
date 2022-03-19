import { useState, useRef, useEffect, useContext } from "react";
import {
  Box,
  CardContent,
} from "@mui/material";

import db from "../store/db";
import { CharacterContext } from "../context/CharacterContext";

// Components
import { Loading, TouchCard } from "./generics";
import PickCharacter from "./characterViews/PickCharacter";
import DisplayCharacter from "./characterViews/DisplayCharacter";

// Interfaces
import { PlayerData, CharactersData } from "../utils/interfaces";

type Props = {
  membershipId: number;
  characterId: number;
  data?: CharactersData;
  onLoadFireteam: (player: PlayerData) => void;
}

const CharacterCard = ( { membershipId, characterId, data, onLoadFireteam }: Props ) => {
  const context = useContext(CharacterContext);
  const player = useRef<PlayerData>({
    bungieGlobalDisplayName: "",
    bungieGlobalDisplayNameCode: 0,
    iconPath: "",
    membershipType: 0,
    membershipId: 0,
  });
  const [first, setFirst] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    db.AppPlayers.get(membershipId).then(loadedPlayer => {
      if (!loadedPlayer) {
        // TODO: handle error
        return;
      }
      player.current = loadedPlayer;
      context.loadCardData(membershipId).then(() => {
        setLoading(false);
      });
    });
  }, []);

  useEffect(() => {
    if (loading || !data || !!characterId) {
      return;
    }

    // Sort by loaded
    const characters = data.characters.data;
    const firstKey = Object.keys(characters).sort((a: any, b: any) => {
      return (new Date(characters[a].dateLastPlayed) as any) +
            (new Date(characters[b].dateLastPlayed) as any);
    })[0];

    context.setCardCharacterId(membershipId, firstKey as any).then(() => setFirst(false));
  }, [loading]);

  return (
    <TouchCard
      className="guardianCard"
      sx={{ m: 1, mb: 0, p: 0, background: "rgb(16 19 28 / 0.75)" }}
      onDelete={() => context.deleteCard(membershipId)}
    >
      <CardContent sx={{ p: 0, pb: "0px !important" }}>
        {loading && <Box sx={{ p: 0 }}><Loading marginTop="48px" /></Box>}
        {!loading && data && !first && !characterId && <PickCharacter player={player.current} data={data} />}
        {!loading && data && !!characterId &&
          <DisplayCharacter
            player={player.current}
            data={data}
            characterId={characterId}
            onLoadFireteam={() => onLoadFireteam(player.current)}
            onChangeCharacter={() => context.setCardCharacterId(membershipId, 0)}
          />}
      </CardContent>
    </TouchCard>
  );
}

export default CharacterCard;