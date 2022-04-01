import { memo } from "react";
import {
  Box,
  Typography,
} from "@mui/material";

import "./Loading.css";

type Props = {
  marginTop: string;
  loadingText?: string;
}

const Loading = memo(({ marginTop, loadingText }: Props) => {
  return (
    <Box className="loading" sx={{ mt: marginTop, justifyContent: "center", textAlign: "center" }}>
      <div className="clock"></div>
      {loadingText &&
        <Typography variant="body1" sx={{ color: "white" }}>{loadingText}</Typography>}
    </Box>
  );
});

export default Loading;
