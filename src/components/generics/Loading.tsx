import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  CircularProgress,
  Typography,
} from "@mui/material";

interface LoaderProps {
  marginTop: string;
  loadingText?: string;
}

const Loading = ({ marginTop, loadingText}: LoaderProps) => {
  return (
    <Box className="loading" sx={{ mt: marginTop, justifyContent: "center", textAlign: "center" }}>
      <CircularProgress sx={{ color: loadingText? "white" : "" }} size={60} />
      {loadingText && <Typography variant="body1" sx={{ color: "white" }}>{loadingText}</Typography>}
    </Box>
  );
};

export default Loading;
