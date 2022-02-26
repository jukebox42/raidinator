import React, { useState, useEffect, useMemo } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import {
  Stack,
  Paper,
} from "@mui/material";

import db from "../../store/db";
import { getAssetUrl } from "../../utils/functions";

interface ModsProps {
  characterPlugSets: any;
  characterId: string;
}

const Mods = ( {characterPlugSets, characterId}: ModsProps ) => {
  console.log("M C", characterPlugSets);
  const plugs = useLiveQuery(async () => {
    if (!characterPlugSets) {
      return;
    }
    const characterPlugs = characterPlugSets.data[characterId].plugs;
    let flatPlugs: any[] = [];
    Object.keys(characterPlugs).forEach(plugSet => {
      flatPlugs = flatPlugs.concat(characterPlugs[plugSet]);
    });
    console.log("F", flatPlugs);
    // push items into a map so they are easier to index
    return await db.DestinyInventoryItemDefinition.bulkGet(
      flatPlugs.map(item => item.plugItemHash.toString())
    );
  });

  if (!plugs) {
    return <></>;
  }

  return (
    <Stack>
      {plugs.map(plug => {
        if (plug?.displayProperties?.icon) {
          console.log(plug.displayProperties.name, plug);
          return (
            <div>
            <Paper key={plug.hash} elevation={0} className="">
              <img src={getAssetUrl(plug.displayProperties.icon)} className="" />
            </Paper>
            {plug.displayProperties.name}
            </div>
          );
        }
      })}
    </Stack>
  )
}

export default Mods;