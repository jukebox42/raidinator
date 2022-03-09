import React, { useState, useEffect, useMemo } from "react";
import {
  Stack,
  Paper,
  Typography,
} from "@mui/material";

import { getAssetUrl } from "../../utils/functions";

// Interfaces
import * as BI from "../../bungie/interfaces";
import { LIGHT_STAT_HASH } from "../../utils/constants";

interface CharacterStatsProps {
  stats: {
    [key: number]: number;
  };
  statTypes: BI.Manifest.DestinyStatType[];
}

const CharacterStats = ( { stats, statTypes }: CharacterStatsProps ) => {
  // sort the stats so they match the game. Thankfully they have an index
  statTypes.sort((a,b) => a.index - b.index);

  return (
    <Stack direction="row">
      {statTypes.map(statType => {
        // Skip the light stat. We don't want/need it in the list.
        if (statType.hash.toString() === LIGHT_STAT_HASH) {
          return;
        }

        // Find the stat that matches
        const statKey = Object.keys(stats).find(statHash => statType.hash.toString() === statHash);
        if (!statKey) {
          return;
        }

        return (
          <Paper key={statKey} elevation={0} sx={{ display: "flex", m: 1, mb: 0, ml: 0, background: "none" }}>
            <img src={getAssetUrl(statType.displayProperties.icon)} className="icon-stat invert" />
            <Typography variant="caption" sx={{ mt: "-3px" }}>{stats[statKey as any]}</Typography>
          </Paper>
        )
      })}
    </Stack>
  );
}

export default CharacterStats;