import {
  Box,
  Typography,
} from "@mui/material";
import { styled } from "@mui/system";

import { getClassSvg } from "../../partials";

import { PlayerData } from "utils/interfaces";

const PlayerNameWrapper  = styled(Box, {
  name: "PlayerName",
  slot: "Wrapper",
})(({ theme }) => ({
  margin: `${theme.spacing(1)} ${theme.spacing(1)} 0 0`,
  display: "flex",
  ".classSvg": {
    width: "25px",
    height: "25px",
    display: "inline-block",
  }
}));

type Props = {
  player: PlayerData;
  showCode?: boolean;
  classType?: number;
}

const PlayerName = ({ player, showCode, classType }: Props) => {
  return (
    <PlayerNameWrapper>
       {Number.isInteger(classType) && getClassSvg(classType as number)}
      <Typography variant="h5" sx={{ml: 1, mt: "-4px"}} noWrap>
        {player.bungieGlobalDisplayName}
        {showCode && "#" + player.bungieGlobalDisplayNameCode}
      </Typography>
    </PlayerNameWrapper>
  );
};

export default PlayerName;
