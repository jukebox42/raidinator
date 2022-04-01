import { Paper, Typography } from "@mui/material";

import { getAssetUrl } from "../../../utils/functions";

type Props = {
  value: number;
  iconUrl: string;
}

const Stat = ( { value, iconUrl }: Props ) => {

  return (
    <Paper elevation={0} sx={{ display: "flex", m: 1, mb: 0, ml: 0, background: "none" }}>
      <img src={getAssetUrl(iconUrl)} className="icon-stat invert" />
      <Typography variant="caption" sx={{ mt: "-4px" }}>{value}</Typography>
    </Paper>
  );
}

export default Stat;
