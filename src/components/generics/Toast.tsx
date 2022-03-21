import React, { useState } from "react";
import {
  Alert,
  Snackbar,
} from "@mui/material";

export type SeverityType = "info" | "success" | "warning" | "error";

type ToastProps = {
  key: string;
  message: string;
  severity?: SeverityType;
  onClose: (key: string) => void;
}

const Toast = ({ key, message, severity = "info", onClose }: ToastProps) => {
  const [open, setOpen] = useState(true);
  const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
    setTimeout(() => onClose(key), 500);
  };

  return (
    <Snackbar open={open} autoHideDuration={6000} onClose={handleClose} sx={{ bottom: 70 }}>
      <Alert onClose={handleClose} severity={severity} sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default Toast;