import {
  Box,
  Typography,
} from "@mui/material";

import { getClassSvg } from "../partials";

import { PlayerData } from "../../utils/interfaces";

type PlayerNameProps = {
  player: PlayerData;
  showCode?: boolean;
  classType?: number;
}

const PlayerName = ({ player, showCode, classType }: PlayerNameProps) => {
  return (
    <Box sx={{ m: 1, ml: 0, mb: 0, display: "flex" }}>
       {Number.isInteger(classType) &&
        <div className="class-icon">{getClassSvg(classType as number)}</div>}
      <Typography variant="h5" sx={{ml: 1, mt: "-3px"}} >
        {player.bungieGlobalDisplayName}
        {showCode && "#" + player.bungieGlobalDisplayNameCode}
      </Typography>
    </Box>
  );
};

export default PlayerName;
