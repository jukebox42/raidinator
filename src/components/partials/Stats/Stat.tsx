import { Paper, Typography } from "@mui/material";
import { styled } from "@mui/system";

import { getAssetUrl } from "../../../utils/functions";

const SyledPaper  = styled(Paper, {
  name: "PlayerName",
  slot: "Wrapper",
})(({ theme }) => ({
  margin: `${theme.spacing(1)} ${theme.spacing(1)} 0 0`,
  background: "none",
  display: "flex",
  "img": {
    width: "16px",
    height: "16px",
  }
}));

type Props = {
  value: number;
  iconUrl: string;
}

const Stat = ( { value, iconUrl }: Props ) => {

  return (
    <SyledPaper elevation={0}>
      <img src={getAssetUrl(iconUrl)} />
      <Typography variant="caption" sx={{ mt: "-4px" }}>{value}</Typography>
    </SyledPaper>
  );
}

export default Stat;
