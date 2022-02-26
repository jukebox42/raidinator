import React, { useState, useEffect, useMemo } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import {
  Stack,
  Paper,
  Tooltip,
} from "@mui/material";
import { v4 as uuid } from "uuid";

import db from "../../store/db";
import { getAssetUrl } from "../../utils/functions";
import { specialMods } from "../../utils/constants";

interface ModsProps {
  itemSockets: any;
  itemInstances: any;
  characterEquipment: any;
}

const ItemMods = ( {itemSockets, itemInstances, characterEquipment}: ModsProps ) => {
  const plugs = useLiveQuery(async () => {
    if (!itemSockets) {
      return;
    }
    // get item instance ids to filter with. itemSockets includes ALL characters items
    let equippedItemKeys: string[] = [];
    characterEquipment.items.forEach((equipment: any) => equippedItemKeys.push(equipment.itemInstanceId));

    // get full list of plugs in sockets
    let flatPlugs: any[] = [];
    Object.keys(itemInstances.data).forEach(itemId => {
      if (equippedItemKeys.includes(itemId) && itemSockets.data[itemId]) {
        flatPlugs = flatPlugs.concat(itemSockets.data[itemId].sockets);
      }
    });
    // push items into a map so they are easier to index
    return await db.DestinyInventoryItemDefinition.bulkGet(
      flatPlugs.map(item => {
        if (item.plugHash) {
          return item.plugHash.toString();
        }
      })
    );
  });

  if (!plugs) {
    return <></>;
  }

  // console.log("PLUGS", plugs);

  const championRegex = /(Unstoppable|Anti-Barrier|Overload)/;

  return (
    <Stack direction="row" sx={{ml: 1}}>
      {plugs.map(plug => {
        // filter out plugs with icons and a name, ones the match champion mods, exotic intrinsics and a special list(seasonal)
        if (
          plug && plug.displayProperties?.icon && plug.displayProperties?.name  &&
          (
            championRegex.test(plug.displayProperties.name) || // find all unstop
            // (plug.itemTypeAndTierDisplayName === "Exotic Intrinsic" && !/Frame$/.test(plug.displayProperties.name))|| // get exotic armor percs
            specialMods.includes(plug.displayProperties.name)
          )
        ) {
          // console.log(plug.displayProperties.name, plug);
          return (
            <Paper key={uuid()} elevation={0} sx={{ display: "flex", m: 1, mb: 0, ml: 0 }}>
              <Tooltip title={plug.displayProperties.name}>
                <img src={getAssetUrl(plug.displayProperties.icon)} className="icon-mods" />
              </Tooltip>
            </Paper>
          );
        }
      })}
    </Stack>
  )
}

export default ItemMods;