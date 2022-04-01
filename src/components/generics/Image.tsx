import { Paper, PaperProps, SxProps, Theme } from "@mui/material";
import { styled } from "@mui/system";

type ImageVariant = "subclass" | "item" | "energy" | "mod";

type ImageProps = {
  src: string;
  variant?: ImageVariant
  sx?: SxProps<Theme>; // TODO
  className?: string;
}

const iconSize = "55px";

const ItemImage = styled("img")({
  width: iconSize,
  height: iconSize,
  position: "absolute",
  background: "none",
});

const SubclassImage = styled("img")({
  width: iconSize,
  height: iconSize,
  position: "absolute",
  background: "none",
});

const EnergyImage = styled("img")({
  width: "16px",
  height: "16px",
  position: "absolute",
  right: "2px",
  bottom: "2px",
  background: "none",
});

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

const Image = ({src, variant, sx = {}, className = ""}: ImageProps) => {
  if (variant === "subclass") {
    return <SubclassImage src={src} className={className} />
  }
  if (variant === "item") {
    return <ItemImage src={src} className={className} />
  }
  if (variant === "energy") {
    return <EnergyImage src={src} className={className} />
  }
  if (variant === "mod") {
    return <Paper className={className} sx={modSx(src)} />
  }
  return (
    <Paper component="img" src={src} sx={sx} className={className} />
  );
};

export const ImageMod: React.FC<ImageProps> = ({src, className = ""}) => {
  return <Paper className={className} sx={modSx(src)} />;
}

export default Image;
