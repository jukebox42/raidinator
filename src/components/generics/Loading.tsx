import { memo } from "react";
import {
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";

type Props = {
  marginTop: string;
  loadingText?: string;
}

const Loading = memo(({ marginTop, loadingText }: Props) => {
  return (
    <Box className="loading" sx={{ mt: marginTop, justifyContent: "center", textAlign: "center" }}>
      <CircularProgress color="inherit" size={65} />
      {loadingText &&
        <Typography variant="body1" sx={{ color: "white" }}>{loadingText}</Typography>}
    </Box>
  );
});

export default Loading;
