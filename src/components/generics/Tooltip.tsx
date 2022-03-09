import React, { useState, useEffect, useMemo } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import {
  Alert,
  Paper,
  Tooltip,
  Typography,
} from "@mui/material";
import ClickAwayListener from '@mui/material/ClickAwayListener';
import { v4 as uuid } from "uuid";
import uniq from "lodash/uniq";

import { getAssetUrl } from "../../utils/functions";



type TooltipProps = {
  title: any;
}

const ToolTip: React.FC<TooltipProps> = ( {title, children} ) => {
  const [open, setOpen] = React.useState(false);
  
  const handleTooltipClose = () => setOpen(false);

  const handleTooltipOpen = () => setOpen(true);

  return (
    <ClickAwayListener onClickAway={handleTooltipClose}>
    <Paper
      elevation={0}
      sx={{ display: "flex", m: 1, mb: 0, ml: 0, position: "relative", background: "none" }}
      onClick={handleTooltipOpen}
    >
      <Tooltip
        onClose={handleTooltipClose}
        open={open}
        arrow={true}
        disableFocusListener
        disableHoverListener
        disableTouchListener
        title={title}
      >
        {children as any}
      </Tooltip>
    </Paper>
    </ClickAwayListener>
  );
}

export default Tooltip;