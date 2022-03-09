import { memo } from "react";
import {
  Box,
  Typography,
} from "@mui/material";

import "./Loading.css";

type LoaderProps = {
  marginTop: string;
  loadingText?: string;
}

const Loading = memo(({ marginTop, loadingText}: LoaderProps) => {
  const circleClasses = ["clock"];
  //if (loadingText) {
    circleClasses.push("whiteClock");
  //}
  return (
    <Box className="loading" sx={{ mt: marginTop, justifyContent: "center", textAlign: "center" }}>
      <div className={circleClasses.join(" ")}></div>
      {loadingText &&
        <Typography variant="body1" sx={{ color: "white" }}>{loadingText}</Typography>}
    </Box>
  );
});

export default Loading;
