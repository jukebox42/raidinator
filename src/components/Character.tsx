import { useState, useRef, useEffect, useContext } from "react";
import {
  Box,
  CardContent,
} from "@mui/material";

import db from "../store/db";
import { CharacterContext } from "../context/CharacterContext";
import { AppContext } from "../context/AppContext";

// Components
import { Loading, TouchCard } from "./generics";
import PickCharacter from "./characterViews/PickCharacter";
import DisplayCharacter from "./characterViews/DisplayCharacter";

// Interfaces
import { PlayerData } from "../utils/interfaces";

type Props = {
  player: PlayerData;
  refresh: boolean;
  onLoadFireteam: (player: PlayerData) => void;
}

const Character = ( { player, onLoadFireteam, refresh }: Props ) => {
  const appContext = useContext(AppContext);
  const context = useContext(CharacterContext);
  const [first, setFirst] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("F", refresh);
    context.loadData(refresh).then(() => setLoading(false));
  }, [refresh]);

  useEffect(() => {
    if (loading || !context.data || !!context.characterId) {
      return;
    }

    // Sort by loaded
    const characters = context.data.characters.data;
    const firstKey = Object.keys(characters).sort((a: any, b: any) => {
      return (new Date(characters[a].dateLastPlayed) as any) +
            (new Date(characters[b].dateLastPlayed) as any);
    })[0];

    context.setCharacterId(firstKey as any);
    setFirst(false);
  }, [loading, context.data, context.setCharacterId]);

  const data = context.data;
  const characterId = context.characterId;

  return (
    <TouchCard
      className="guardianCard"
      sx={{ m: 1, mb: 0, p: 0, background: "rgb(16 19 28 / 0.75)" }}
      onDelete={() => appContext.deleteCard(player.membershipId)}
    >
      <CardContent sx={{ p: 0, pb: "0px !important" }}>
        {(loading) && <Box sx={{ p: 0 }}><Loading marginTop="48px" /></Box>}
        {!loading && data && !first && !characterId && <PickCharacter player={player} data={data} />}
        {!loading && data && !!characterId &&
          <DisplayCharacter
            player={player}
            data={data}
            characterId={characterId}
            onLoadFireteam={() => onLoadFireteam(player)}
            onChangeCharacter={() => context.setCharacterId(0)}
          />}
      </CardContent>
    </TouchCard>
  );
}

export default Character;