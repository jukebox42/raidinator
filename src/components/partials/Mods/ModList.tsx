import { useContext } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { Grid } from "@mui/material";
import { v4 as uuid } from "uuid";

import db from "store/db";
import { isArtifactMod } from "./rules/artifactMods";
import { getChampionMods, checkChampionMod } from "./rules/championRules";
import {
  getChargedWithLightChargerMods,
  getChargedWithLightSpenderMods,
  checkChargedWithLightMod,
} from "./rules/chargedWithLightRules";

import {
  getWellGeneratorMods,
  getWellSpenderMods,
  checkWellMod,
} from "./rules/wellRules";

import {
  getRaidMods,
} from "./rules/raidRules";

import {
  getAmmoFinderMods,
  checkAmmoFinderMod,
} from "./rules/ammoFinderRules";

// Components
import Mod from "./Mod";

// Interfaces
import { CharactersData } from "utils/interfaces";
import * as BI from "bungie/interfaces/";
import { DestinyItemSocketState } from "bungie/interfaces/Destiny/Entities/Items";
import { AppContext } from "context/AppContext";

type Props = {
  data: CharactersData;
  characterId: number;
  weaponTypes: string[]; // TODO this could be better yeah?
  weaponEnergyTypes: BI.Destiny.DestinyEnergyType[];
  subclassEnergyType: BI.Destiny.DestinyEnergyType;
}

const ModList = ( {data, characterId, weaponTypes, weaponEnergyTypes, subclassEnergyType}: Props ) => {
  const appContext = useContext(AppContext);
  const instances = data.itemComponents.instances.data;
  const sockets = data.itemComponents.sockets.data;
  const characterEquipment = data.characterEquipment.data[characterId];

  const plugs = useLiveQuery(async () => {
    // get item instance ids to filter with. itemSockets includes ALL characters items
    const equippedItemKeys = characterEquipment.items.map((e: any) => e.itemInstanceId.toString());

    // get full list of plugs in sockets
    let flatPlugs: DestinyItemSocketState[] = [];
    Object.keys(instances).forEach(itemId => {
      if (equippedItemKeys.includes(itemId) && sockets[itemId as any]) {
        flatPlugs = flatPlugs.concat(sockets[itemId as any].sockets);
      }
    });
    // push items into a map so they are easier to index
    return await db.DestinyInventoryItemDefinition.bulkGet(
      flatPlugs.filter(i => !!i.plugHash).map(i => i.plugHash.toString())
    );
  }) as BI.Destiny.Definitions.DestinyInventoryItemDefinition[];

  if (!plugs || plugs.length === 0) {
    return <></>;
  }

  // Get mods by type
  const championMods = getChampionMods(plugs);
  const chargedWithLightChargerMods = getChargedWithLightChargerMods(plugs);
  const chargedWithLightSpenderMods = getChargedWithLightSpenderMods(plugs);
  const wellGeneratorMods = getWellGeneratorMods(plugs);
  const wellSpenderMods = getWellSpenderMods(plugs);
  const wellEnergies: number[] = []; // hold energy from generators
  const ammoFinderMods = getAmmoFinderMods(plugs);
  const raidMods = getRaidMods(plugs);

  return (
    <Grid container spacing={1} sx={{ mt:0, ml: 1, mb: 1}}>
      {appContext.appSettings.championMods && championMods.map(plug => {
        // Champion Mods
        const good = checkChampionMod(plug, weaponTypes, subclassEnergyType);
        return (<Mod key={uuid()} plug={plug} showError={!good} reason="Required champion weapon is not equipped." />);
      })}
      {appContext.appSettings.ammoMods && ammoFinderMods.map(plug => {
        // Ammo Finder Mods
        const good = checkAmmoFinderMod(plug, weaponTypes);
        if (!good) {
          return (<Mod key={uuid()} plug={plug} showError={!good} reason="Matching weapon is not equipped." />);
        }
      })}
      {appContext.appSettings.lightMods && chargedWithLightChargerMods.map(plug => {
        // Charged With Light Mods
        const good = checkChargedWithLightMod(plug, weaponTypes, weaponEnergyTypes, subclassEnergyType);
        const canUse = chargedWithLightSpenderMods.length > 0;
        const reason = !canUse ? "Missing mods to spend charged with light." : "Missing requirements to activate this mod.";
        return (<Mod key={uuid()} plug={plug} showError={!good && canUse} showWarning={!good && !canUse} reason={reason} />);
      })}
      {appContext.appSettings.lightMods && chargedWithLightSpenderMods.map(plug => {
        // Charged With Light Mods
        const good = checkChargedWithLightMod(plug, weaponTypes, weaponEnergyTypes, subclassEnergyType);
        const canCreate = chargedWithLightChargerMods.length > 0;
        const reason = !canCreate ? "Missing mods to create charged with light." : "Missing requirements to activate this mod.";
        return (<Mod key={uuid()} plug={plug} showError={!good && canCreate} showWarning={!good && !canCreate} reason={reason} />);
      })}
      {appContext.appSettings.wellMods && wellGeneratorMods.map(plug => {
        // Generating Well Mods
        const wellType = checkWellMod(plug, weaponEnergyTypes, subclassEnergyType);
        const good = Number.isInteger(wellType);
        if (good) {
          wellEnergies.push(wellType as BI.Destiny.DestinyEnergyType);
        }
        const canUse = wellSpenderMods.length > 0;
        const reason = !canUse ? "Missing mods to use wells." : "Missing requirements to activate this mod.";
        return (<Mod key={uuid()} plug={plug} showError={!good && canUse} showWarning={!good && !canUse} reason={reason} />);
      })}
      {appContext.appSettings.wellMods && wellSpenderMods.map(plug => {
        // Spending Well Mods
        const good = checkWellMod(plug, weaponEnergyTypes, subclassEnergyType, wellEnergies);
        const canCreate = wellGeneratorMods.length > 0;
        const reason = !canCreate ? "Missing mods to create wells." : "Missing requirements to activate this mod.";
       return (<Mod key={uuid()} plug={plug} showError={!good && canCreate} showWarning={!good && !canCreate} reason={reason} />);
      })}
      {appContext.appSettings.raidMods && raidMods.map(plug => {
        // Raid Mods
        return (<Mod key={uuid()} plug={plug} />);
      })}
      {appContext.appSettings.specialMods && plugs.map(plug => {
        if (!plug) {
          return;
        }
        // if (plug.displayProperties) { console.log(plug.displayProperties.name, plug); }
        // Additional Special Mods
        if (isArtifactMod(plug)) {
          return (<Mod key={uuid()} plug={plug} />);
        }
        return;
      })}
    </Grid>
  )
}

export default ModList;