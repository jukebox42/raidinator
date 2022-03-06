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

// Interfaces
import * as BI from "../../bungie/interfaces"
import db from "../../store/db";

interface ModProps {
  plug: BI.Destiny.Definitions.DestinyInventoryItemDefinition;
  showWarning?: boolean;
  warningReason?: string;
}

const Mod = ( {plug, showWarning, warningReason}: ModProps ) => {
  // console.log(plug.displayProperties.name, plug);
  const [open, setOpen] = React.useState(false);
  const [perks, setPerks] = React.useState<any[]>([]);

  useEffect(() => {
    const perks = plug.perks.map((p:any) => p.perkHash.toString());
    db.DestinySandboxPerkDefinition.bulkGet(perks).then(r => setPerks(uniq(r)));
  })

  const handleTooltipClose = () => setOpen(false);

  const handleTooltipOpen = () => setOpen(true);

  return (
    <ClickAwayListener onClickAway={handleTooltipClose}>
    <Paper
      elevation={0}
      sx={{ display: "flex", m: 1, mb: 0, ml: 0, position: "relative", background: "none" }}
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
            {showWarning && warningReason && <Alert severity="warning">{warningReason}</Alert>}
            <Typography variant="body1">{plug.displayProperties.name}:</Typography>
            {perks && perks.map(p => <Typography key={uuid()} variant="caption" component="p" mt={1}>{p.displayProperties.description}</Typography>)}
            {plug.tooltipNotifications.map(t => <Typography key={uuid()} variant="caption" component="p" mt={1}>{t.displayString}</Typography>)}
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