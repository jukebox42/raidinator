import { Typography, Paper } from "@mui/material";
import { styled } from "@mui/system";

import { getAssetUrl } from "../../../utils/functions";

const LightIcon  = styled(Paper, {
  name: "Light",
  slot: "Wrapper",
})(({ theme }) => ({
  background: "none",
  display: "inline-block",
  "img": {
    width: "20px",
    height: "20px",
  }
}));

type Props = {
  light: number;
  imageUrl: string;
}

const Light = ({ light, imageUrl }: Props) => {
  return (
    <>
      <LightIcon elevation={0}><img src={getAssetUrl(imageUrl)} /></LightIcon>
      <Typography variant="subtitle1" sx={{ mt: "-4px" }}>{light}</Typography>
    </>
  )
}

export default Light;