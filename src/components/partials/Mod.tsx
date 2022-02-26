import React, { useState, useEffect, useMemo } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import {
  Stack,
  Paper,
  Tooltip,
  Typography,
} from "@mui/material";

import { getAssetUrl } from "../../utils/functions";

// Interfaces
import * as BI from "../../bungie/interfaces"


interface ModProps {
  plug: BI.Destiny.Definitions.DestinyInventoryItemDefinition;
}

const Mod = ( {plug}: ModProps ) => {
  return (
    <Paper elevation={0} sx={{ display: "flex", m: 1, mb: 0, ml: 0 }}>
      <Tooltip
        title={
          <>
            <Typography>{plug.displayProperties.name}</Typography>
            {/*TODO: description would be nice*/}
          </>
        }
        arrow={true}
        enterTouchDelay={0}
      >
        <img src={getAssetUrl(plug.displayProperties.icon)} className="icon-mods" />
      </Tooltip>
    </Paper>
  );
}

export default Mod;