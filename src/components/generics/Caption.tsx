import React from "react";
import { Typography } from "@mui/material";
import { blueGrey } from '@mui/material/colors';

type CaptionProps = {
  children: React.ReactElement<any, any> | string;
  fade?: boolean;
}

const Caption = ( { children, fade = false }: CaptionProps ) => {
  const sx = fade ? { color: blueGrey[300] } : {};

  return (
    <Typography variant="caption" component="p" mt={1} sx={sx}>{children}</Typography>
  );
}

export default Caption;