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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (lastRefresh === context.lastRefresh) {
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
        {!context.error && !loading && data && !characterId &&
          <PickCharacter player={player} data={data} />}
        {!context.error && !loading && data && !!characterId &&
          <DisplayCharacter
            player={player}
            data={data}
            characterId={characterId}
            onLoadFireteam={() => onLoadFireteam(player)}
            onChangeCharacter={() => { context.setCharacterId(0); }}
          />}
      </CardContent>
    </TouchCard>
  );
}

export default Character;