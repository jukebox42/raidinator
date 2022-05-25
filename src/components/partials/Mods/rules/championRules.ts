import intersection from "lodash/intersection";

import { DestinyEnergyType } from "bungie/interfaces/Destiny";
import { DestinyInventoryItemDefinition } from "bungie/interfaces/Destiny/Definitions";

interface ChampionModTypes {
  name: string;
  hash: number;
  requiredTraidIds?: string[];
  requiredEnergyTypes?: DestinyEnergyType[]; // this is subclass type
}

const championMods: ChampionModTypes[] = [
  // === Artifact ===
  { name: "Piercing Sidearms", hash: 1942359019, requiredTraidIds: ["weapon_type.sidearm"] },
  { name: "Overload Rounds", hash: 1942359016, requiredTraidIds: ["weapon_type.auto_rifle", "weapon_type.submachinegun"] },
  { name: "Unstoppable Scout Rifle", hash: 1942359017, requiredTraidIds: ["weapon_type.scout_rifle"] },
  { name: "Unstoppable Glaive", hash: 1942359022, requiredTraidIds: ["weapon_type.glaive"] },
  { name: "Anti-Barrier Pulse Rifle", hash: 1942359023, requiredTraidIds: ["weapon_type.pulse_rifle"] },
  { name: "Overload Trace Rifle", hash: 706723264, requiredTraidIds: ["weapon_type.trace_rifle"] },
  { name: "Molten Overload", hash: 706723269, requiredEnergyTypes: [DestinyEnergyType.Thermal] },
];

const isChampionMod = (mod: DestinyInventoryItemDefinition) => /^(Unstoppable|Anti-Barrier|Overload|Molten Overload)/.test(mod.displayProperties.name);

/**
 * Filter mods array down to mods that are champion mods
 */
export const getChampionMods = (mods: DestinyInventoryItemDefinition[]) => mods.filter(m => isChampionMod(m));

/**
 * Check if a charged with light mod's criteria is met.
 */
export const checkChampionMod = (
  mod: DestinyInventoryItemDefinition,
  weaponTypes: string[],
  subclassEnergy: DestinyEnergyType
): boolean | null => {
  // this function only cares about champion mods
  if (!isChampionMod(mod)) {
    return null;
  }

  const championMod = championMods.find(m => m.hash === mod.hash);
  if (!championMod) {
    console.error("FAILED TO FIND CHAMPION MOD. MISSING FROM ARRAY", mod);
    return null;
  }

  // if the mod depends on a specific weapon type
  if (championMod.requiredTraidIds) {
    const matchingTraits = intersection(championMod.requiredTraidIds, weaponTypes);
    return matchingTraits.length > 0;
  }

  // if the mod depends on a subclass energy type
  if (championMod.requiredEnergyTypes) {
    return championMod.requiredEnergyTypes.includes(subclassEnergy);
  }

  // we should never make it here but just in case
  return null;
}