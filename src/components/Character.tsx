import { useState, useEffect, useContext } from "react";
import { CardContent } from "@mui/material";

import { CharacterContext } from "../context/CharacterContext";
import { AppContext } from "../context/AppContext";

// Components
import { TouchCard } from "./generics";
import LoadingCharacter from "./characterViews/LoadingCharacter";
import PickCharacter from "./characterViews/PickCharacter";
import DisplayCharacter from "./characterViews/DisplayCharacter";

// Interfaces
import { PlayerData } from "../utils/interfaces";
import CharacterError from "./characterViews/CharacterError";

type Props = {
  player: PlayerData;
  lastRefresh: number;
  onRefreshed: (membershipId: number) => void;
  onLoadFireteam: (player: PlayerData) => void;
}

const Character = ( { player, onLoadFireteam, lastRefresh, onRefreshed }: Props ) => {
  const appContext = useContext(AppContext);
  const context = useContext(CharacterContext);
  const [first, setFirst] = useState(true); // handle first load so we can show the last used character
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (lastRefresh === context.lastRefresh || first) {
      return;
    }

    context.setLastRefresh(lastRefresh);
    setLoading(true);
    context.loadData(true).then(() => {
      setLoading(false);
      onRefreshed(player.membershipId);
    });
  }, [lastRefresh]);

  useEffect(() => {
    context.loadData().then(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (loading || !context.data || !!context.characterId || !first) {
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
      sx={{ position: "relative", minHeight: "155px", m: 1, mb: 0, p: 0, background: "rgb(16 19 28 / 0.75)" }}
      onDelete={() => appContext.deleteCard(player.membershipId)}
    >
      <CardContent sx={{ p: 0, pb: "0px !important" }}>
        {context.error && <CharacterError />}
        {!context.error && loading && <LoadingCharacter />}
        {!context.error && !loading && data && !first && !characterId &&
          <PickCharacter player={player} data={data} />}
        {!context.error && !loading && data && !!characterId &&
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