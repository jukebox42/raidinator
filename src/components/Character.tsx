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
  const [loading, setLoading] = useState(false);

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

  const changeCharacter = () => {
    context.setCardCharacterId(membershipId, 0);
  }

  return (
    <TouchCard
      className="guardianCard"
      sx={{m: 1, mb: 0, p: 0, background: "rgb(16 19 28 / 0.65)" }}
      onDelete={() => context.deleteCard(membershipId)}
    >
      <CardContent sx={{ p: 0, pb: "0px !important" }}>
        {loading && <Box sx={{ p: 0 }}><Loading marginTop="48px" /></Box>}
        {!loading && data && !characterId && <PickCharacter player={player.current} data={data} />}
        {!loading && data && characterId &&
          <DisplayCharacter
            player={player.current}
            data={data}
            characterId={characterId}
            onLoadFireteam={() => onLoadFireteam(player.current)}
            onChangeCharacter={changeCharacter}
          />}
      </CardContent>
    </TouchCard>
  );
}

export default CharacterCard;