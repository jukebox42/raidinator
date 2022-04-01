import React, { useState } from "react";
import {
  Alert,
  Snackbar,
} from "@mui/material";

export type SeverityType = "info" | "success" | "warning" | "error";

type Props = {
  id: string;
  message: string | React.ReactNode;
  severity?: SeverityType;
  onClose: (key: string) => void;
}

const Toast = ({ id, message, severity = "info", onClose }: Props) => {
  const [open, setOpen] = useState(true);
  const handleClose = (_: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
    setTimeout(() => onClose(id), 500);
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