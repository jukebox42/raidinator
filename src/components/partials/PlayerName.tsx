import React from "react";
import {
  Typography,
} from "@mui/material";

import { PlayerData } from "../../utils/interfaces";

interface PlayerNameProps {
  player: PlayerData;
}

const PlayerName = ({ player }: PlayerNameProps) => {
  return (
    <Typography variant="h6" sx={{ m: 1 }}>
      {player.bungieGlobalDisplayName}#{player.bungieGlobalDisplayNameCode}
    </Typography>
  );
};

export default PlayerName;
