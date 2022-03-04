import React, { useState, useEffect, useMemo } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import {
  Stack,
} from "@mui/material";
import { v4 as uuid } from "uuid";

import db from "../../store/db";
import { getAssetUrl } from "../../utils/functions";
import { specialDamageMods } from "../../utils/constants";
import { getChampionMods, checkChampionMod } from "../../utils/rules/championRules";
import {
  getChargedWithLightChargerMods,
  getChargedWithLightSpenderMods,
  checkChargedWithLightMod,
} from "../../utils/rules/chargedWithLightRules";

import {
  getWellGeneratorMods,
  getWellSpenderMods,
  checkWellMod,
} from "../../utils/rules/wellRules";

// Components
import Mod from "./Mod";

interface ModsProps {
  itemSockets: any; // TODO these arent any. we have these interfaces
  itemInstances: any;
  characterEquipment: any;
  weaponTypes: string[]; // TODO this could be better yeah?
  weaponEnergyTypes: any[]; // TODO same here
  subclassEnergyType: any;
}

const ItemMods = ( {itemSockets, itemInstances, characterEquipment, weaponTypes, weaponEnergyTypes, subclassEnergyType}: ModsProps ) => {
  const plugs = useLiveQuery(async () => {
    if (!itemSockets) {
      return;
    }
    // get item instance ids to filter with. itemSockets includes ALL characters items
    let equippedItemKeys: string[] = [];
    characterEquipment.items.forEach(
      (equipment: any) => equippedItemKeys.push(equipment.itemInstanceId));

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

  const championMods = getChampionMods(plugs);

  const chargedWithLightChargerMods = getChargedWithLightChargerMods(plugs);
  const chargedWithLightSpenderMods = getChargedWithLightSpenderMods(plugs);

  const wellGeneratorMods = getWellGeneratorMods(plugs);
  const wellSpenderMods = getWellSpenderMods(plugs);
  let wellEnergies: number[] = []; // hold energy from generators

  return (
    <Stack direction="row" sx={{ml: 1}}>
      {championMods.map((plug) => {
        // Champion Mods
        const allGood = checkChampionMod(plug, weaponTypes, subclassEnergyType);
        return (<Mod key={uuid()} plug={plug} showWarning={!allGood} warningReason="Missing required weapon." />);
      })}
      {chargedWithLightChargerMods.map((plug) => {
        // Charged With Light Mods
        const allGood = checkChargedWithLightMod(plug, weaponTypes, weaponEnergyTypes, subclassEnergyType);
        const hasSpenders = chargedWithLightSpenderMods.length > 0;
        const warningReason = !hasSpenders ? "Missing mods to spend charged with light." : "Missing requirements to activate.";
        return (<Mod key={uuid()} plug={plug} showWarning={!allGood || !hasSpenders} warningReason={warningReason} />);
      })}
      {chargedWithLightSpenderMods.map((plug) => {
        // Charged With Light Mods
        const allGood = checkChargedWithLightMod(plug, weaponTypes, weaponEnergyTypes, subclassEnergyType);
        const hasChargers = chargedWithLightChargerMods.length > 0;
        const warningReason = !hasChargers ? "Missing mods to create charged with light." : "Missing requirements to activate.";
        return (<Mod key={uuid()} plug={plug} showWarning={!allGood || !hasChargers} warningReason={warningReason} />);
      })}
      {wellGeneratorMods.map((plug) => {
        // Generating Well Mods
        const wellType = checkWellMod(plug, weaponEnergyTypes, subclassEnergyType);
        const allGood = Number.isInteger(wellType);
        if (allGood) {
          wellEnergies.push(wellType as any);
        }
        const hasSpenders = wellSpenderMods.length > 0;
        const warningReason = !hasSpenders ? "Missing mods to use wells." : "Missing requirements to activate.";
        return (<Mod key={uuid()} plug={plug} showWarning={!allGood || !hasSpenders} warningReason={warningReason} />);
      })}
      {wellSpenderMods.map((plug) => {
        // Spending Well Mods
        const allGood = checkWellMod(plug, weaponEnergyTypes, subclassEnergyType, wellEnergies);
        const hasChargers = wellGeneratorMods.length > 0;
        const warningReason = !hasChargers ? "Missing mods to create wells." : "Missing requirements to activate.";
       return (<Mod key={uuid()} plug={plug} showWarning={!allGood || !hasChargers} warningReason={warningReason} />);
      })}
      {plugs.map((plug) => {
        if (!plug) {
          return;
        }
        // TODO: Exotic weapon/armor abilities
        // TODO: catch wasted stat mods
        // TODO: Ammo Finder Mods
        // Additional Special Mods
        if (plug.displayProperties) {
          //console.log(plug.displayProperties.name, plug);
        }
        if (plug.displayProperties && specialDamageMods.includes(plug.displayProperties.name)) {
          return (<Mod key={uuid()} plug={plug} />);
        }
      })}
    </Stack>
  )
}

export default ItemMods;