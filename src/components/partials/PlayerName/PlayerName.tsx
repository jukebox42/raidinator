import {
  Box,
  Typography,
} from "@mui/material";
import { styled } from "@mui/system";

import { getClassSvg } from "../../partials";

import { PlayerData } from "../../../utils/interfaces";

type Props = {
  player: PlayerData;
  showCode?: boolean;
  classType?: number;
}

const StylesPlayerName  = styled(Box, {
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

const PlayerName = ({ player, showCode, classType }: Props) => {
  return (
    <StylesPlayerName>
       {Number.isInteger(classType) && getClassSvg(classType as number)}
      <Typography variant="h5" sx={{ml: 1, mt: "-4px"}}>
        {player.bungieGlobalDisplayName}
        {showCode && "#" + player.bungieGlobalDisplayNameCode}
      </Typography>
    </StylesPlayerName>
  );
};

export default PlayerName;
