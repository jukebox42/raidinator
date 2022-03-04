import React, { useState, useEffect, useMemo } from "react";
import {
  Stack,
  Paper,
  Typography,
} from "@mui/material";

import { getAssetUrl } from "../../utils/functions";

// Interfaces
import * as BI from "../../bungie/interfaces";

interface CharacterStatsProps {
  stats: {
    [key: number]: number;
  };
  statTypes: BI.Manifest.DestinyStatType[];
}

const CharacterStats = ( { stats, statTypes }: CharacterStatsProps ) => {
  return (
    <Stack direction="row">
      {Object.keys(stats).map(statHash => {
        // Skip the light stat. We don't want/need it in the list.
        if (statHash === "1935470627") {
          return;
        }

        // Find the statType that matches
        const statType = statTypes.find(type => type.hash.toString() === statHash);
        if (!statType) {
          return;
        }

        return (
          <Paper key={statHash} elevation={0} sx={{ display: "flex", m: 1, mb: 0, ml: 0, background: "none" }}>
            <img src={getAssetUrl(statType.displayProperties.icon)} className="icon-stat invert" />
            <Typography variant="caption" sx={{ mt: "-3px" }}>{stats[statHash as any]}</Typography>
          </Paper>
        )
      })}
    </Stack>
  );
}

export default CharacterStats;