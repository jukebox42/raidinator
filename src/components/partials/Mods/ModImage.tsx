
import { Paper, SxProps, Theme } from "@mui/material";

const modCross = {
  position: "absolute",
  content: "''",
  left: 0,
  top: "49%",
  right: 0,
  borderTop: "2px solid",
  transform: "rotate(-45deg)",
}

const modSx = (src: string): SxProps<Theme> => {
  return {
    position: "relative",
    width: "25px",
    height: "25px",
    overflow: "hidden",
    background: `url("${src}") no-repeat`,
    backgroundSize: "contain",
    "&.warning": {
      boxShadow: "0px 0px 0px 2px rgb(255, 167, 38) inset !important",
      position: "relative",
      "&::after": {
        ...modCross,
        borderColor: "rgb(255, 167, 38)",
      }
    },
    "&.error": {
      boxShadow: "0px 0px 0px 2px red inset !important",
      position: "relative",
      "&::after": {
        ...modCross,
        borderColor: "red",
      }
    }
  }
};

type Props = {
  src: string;
  className?: string;
}

export const ModImage = ({src, className = ""}: Props) => {
  return <Paper className={className} sx={modSx(src)} />;
}

export default ModImage;