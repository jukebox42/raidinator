import { Typography } from "@mui/material";

import { getAssetUrl } from "../../../utils/functions";

type Props = {
  light: number;
  imageUrl: string;
}

const Light = ({ light, imageUrl }: Props) => {
  return (
    <>
      <img src={getAssetUrl(imageUrl)} className="icon-light invert" />
      <Typography variant="subtitle1" sx={{ mt: "-4px" }}>{light}</Typography>
    </>
  )
}

export default Light;