import { Button, ButtonProps } from "@mui/material";
import { styled } from "@mui/system";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";

import { getAssetUrl } from "utils/functions";


interface EmblemButtonProps extends ButtonProps {
  emblemPath: string;
  big?: boolean
}

const EmblemButton = styled(Button, {
  name: "EmblemButton",
  slot: "Wrapper",
  shouldForwardProp:(propName) => propName !== "emblemPath" && propName !== "big",
})<EmblemButtonProps>(({ theme, emblemPath, big = false }) => {
  const boxSize = big ? "75px" : "55px";
  const margin = big ? theme.spacing(3) : theme.spacing(1);
  return {
    width: boxSize,
    minWidth: boxSize, //dunno where this comes from
    height: boxSize,
    position: "relative",
    padding: 0,
    backgroundImage: `url("${emblemPath}")`,
    backgroundSize: "contain",
    borderRadius: theme.shape.borderRadius,
    margin: `${margin} ${margin} 0 0`,
    ".classSvg": {
      width: "60px",
      height: "60px",
      position: "absolute",
      left: "8px",
      top: "10px",
    }
  }
});

const onlineSx = { position: "absolute", right: -10, top: -10, width: 30, height: 30 };
const offlineSx = { position: "absolute", right: -5, top: -5, width: 20, height: 20 }

type Props = {
  big?: boolean;
  emblemPath: string;
  isLastOnline: boolean;
  classSvg?: JSX.Element;
  warn?: boolean;
  onClick: () => void;
}

const Emblem = ({ emblemPath, isLastOnline, onClick, classSvg, warn = true, big = false }: Props) => {
  return (
    <EmblemButton
      big={big}
      variant="text"
      onClick={onClick}
      emblemPath={getAssetUrl(emblemPath)}
    >
      {classSvg}
      {isLastOnline && !warn && <LightModeIcon color="success" sx={onlineSx} />}
      {!isLastOnline && warn && <DarkModeIcon color="warning" sx={offlineSx} />}
    </EmblemButton>
  )
}

export default Emblem;