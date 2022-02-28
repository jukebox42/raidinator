import React, { useState, useEffect, useMemo } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import {
  Stack,
  Paper,
  Tooltip,
  Typography,
} from "@mui/material";
import WarningIcon from '@mui/icons-material/Warning';
import ClickAwayListener from '@mui/material/ClickAwayListener';

import { getAssetUrl } from "../../utils/functions";

// Interfaces
import * as BI from "../../bungie/interfaces"

interface ModProps {
  plug: BI.Destiny.Definitions.DestinyInventoryItemDefinition;
  showWarning?: boolean;
  warningReason?: string;
}

const Mod = ( {plug, showWarning, warningReason}: ModProps ) => {
  // console.log(plug.displayProperties.name, plug);
  const [open, setOpen] = React.useState(false);

  const handleTooltipClose = () => {
    setOpen(false);
  };

  const handleTooltipOpen = () => {
    setOpen(true);
  };

  return (
    <ClickAwayListener onClickAway={handleTooltipClose}>
    <Paper
      elevation={0}
      sx={{ display: "flex", m: 1, mb: 0, ml: 0, position: "relative" }}
      className={showWarning? "warning" : ""}
      onClick={handleTooltipOpen}
    >
      <Tooltip
        onClose={handleTooltipClose}
        open={open}
        arrow={true}
        disableFocusListener
        disableHoverListener
        disableTouchListener
        title={
          <>
            {showWarning && warningReason &&
              <Typography variant="caption" sx={{display: "flex"}}>
                <WarningIcon fontSize="small" />Warning: {warningReason}
              </Typography>}
            <Typography>{plug.displayProperties.name}</Typography>

            {/*TODO: description would be nice*/}
          </>
        }
      >
        <img src={getAssetUrl(plug.displayProperties.icon)} className="icon-mods" />
      </Tooltip>
    </Paper>
    </ClickAwayListener>
  );
}

export default Mod;