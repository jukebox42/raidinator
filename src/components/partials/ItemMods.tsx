import { useLiveQuery } from "dexie-react-hooks";
import { Stack } from "@mui/material";
import { v4 as uuid } from "uuid";

import db from "../../store/db";
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

import {
  getRaidMods,
} from "../../utils/rules/raidRules";

import {
  getAmmoFinderMods,
  checkAmmoFinderMod,
} from "../../utils/rules/ammoFinderRules";

// Components
import Mod from "./Mod";

// Interfaces
import { DestinyItemSocketState } from "../../bungie/interfaces/Destiny/Entities/Items";

type ItemModsProps = {
  guardian: any;
  weaponTypes: string[]; // TODO this could be better yeah?
  weaponEnergyTypes: any[]; // TODO same here
  subclassEnergyType: any;
}

const ItemMods = ( {guardian, weaponTypes, weaponEnergyTypes, subclassEnergyType}: ItemModsProps ) => {
  // const context = useContext(GuardianContext);
  const instances = guardian.itemComponents.instances;
  const sockets = guardian.itemComponents.sockets;
  const characterEquipment = guardian.inventory;

  const plugs = useLiveQuery(async () => {
    if (!sockets) {
      return;
    }
    // get item instance ids to filter with. itemSockets includes ALL characters items
    const equippedItemKeys = characterEquipment.items.map((e: any) => e.itemInstanceId.toString());

    //console.log(sockets.data["6917529623489675981"]);

    // get full list of plugs in sockets
    let flatPlugs: DestinyItemSocketState[] = [];
    Object.keys(instances.data).forEach(itemId => {
      if (equippedItemKeys.includes(itemId) && sockets.data[itemId as any]) {
        flatPlugs = flatPlugs.concat(sockets.data[itemId as any].sockets);
      }
    });
    // push items into a map so they are easier to index
    return await db.DestinyInventoryItemDefinition.bulkGet(
      flatPlugs.filter(i => !!i.plugHash).map(i => i.plugHash.toString())
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
  const wellEnergies: number[] = []; // hold energy from generators
  const ammoFinderMods = getAmmoFinderMods(plugs);
  const raidMods = getRaidMods(plugs);

  return (
    <Stack direction="row" sx={{ml: 1}}>
      {championMods.map(plug => {
        // Champion Mods
        const allGood = checkChampionMod(plug, weaponTypes, subclassEnergyType);
        return (<Mod key={uuid()} plug={plug} showWarning={!allGood} warningReason="Required champion weapon is not equipped." />);
      })}
      {ammoFinderMods.map(plug => {
        // Ammo Finder Mods
        const allGood = checkAmmoFinderMod(plug, weaponTypes);
        return (<Mod key={uuid()} plug={plug} showWarning={!allGood} warningReason="Matching weapon is not equipped." />);
      })}
      {chargedWithLightChargerMods.map(plug => {
        // Charged With Light Mods
        const allGood = checkChargedWithLightMod(plug, weaponTypes, weaponEnergyTypes, subclassEnergyType);
        const hasSpenders = chargedWithLightSpenderMods.length > 0;
        const warningReason = !hasSpenders ? "Missing mods to spend charged with light." : "Missing requirements to activate this mod.";
        return (<Mod key={uuid()} plug={plug} showWarning={!allGood || !hasSpenders} warningReason={warningReason} />);
      })}
      {chargedWithLightSpenderMods.map(plug => {
        // Charged With Light Mods
        const allGood = checkChargedWithLightMod(plug, weaponTypes, weaponEnergyTypes, subclassEnergyType);
        const hasChargers = chargedWithLightChargerMods.length > 0;
        const warningReason = !hasChargers ? "Missing mods to create charged with light." : "Missing requirements to activate this mod.";
        return (<Mod key={uuid()} plug={plug} showWarning={!allGood || !hasChargers} warningReason={warningReason} />);
      })}
      {wellGeneratorMods.map(plug => {
        // Generating Well Mods
        const wellType = checkWellMod(plug, weaponEnergyTypes, subclassEnergyType);
        const allGood = Number.isInteger(wellType);
        if (allGood) {
          wellEnergies.push(wellType as any);
        }
        const hasSpenders = wellSpenderMods.length > 0;
        const warningReason = !hasSpenders ? "Missing mods to use wells." : "Missing requirements to activate this mod.";
        return (<Mod key={uuid()} plug={plug} showWarning={!allGood || !hasSpenders} warningReason={warningReason} />);
      })}
      {wellSpenderMods.map(plug => {
        // Spending Well Mods
        const allGood = checkWellMod(plug, weaponEnergyTypes, subclassEnergyType, wellEnergies);
        const hasChargers = wellGeneratorMods.length > 0;
        const warningReason = !hasChargers ? "Missing mods to create wells." : "Missing requirements to activate this mod.";
       return (<Mod key={uuid()} plug={plug} showWarning={!allGood || !hasChargers} warningReason={warningReason} />);
      })}
      {raidMods.map(plug => {
        // Raid Mods
        return (<Mod key={uuid()} plug={plug} />);
      })}
      {plugs.map(plug => {
        if (!plug) {
          return;
        }
        // Additional Special Mods
        if (plug.displayProperties) {
          //console.log(plug.displayProperties.name, plug);
        }
        // Special Mods
        if (plug.displayProperties && specialDamageMods.includes(plug.displayProperties.name)) {
          return (<Mod key={uuid()} plug={plug} />);
        }
        return;
      })}
    </Stack>
  )
}

export default ItemMods;