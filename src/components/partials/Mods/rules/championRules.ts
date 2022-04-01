import intersection from "lodash/intersection";

import { DestinyEnergyType } from "../../../../bungie/interfaces/Destiny";
import { DestinyInventoryItemDefinition } from "../../../../bungie/interfaces/Destiny/Definitions";

interface ChampionModTypes {
  name: string;
  hash: number;
  requiredTraidIds?: string[];
  requiredEnergyTypes?: DestinyEnergyType[]; // this is subclass type
}

const championMods: ChampionModTypes[] = [
  // === Artifact ===
  { name: "Piercing Bowstring", hash: 2081977516, requiredTraidIds: ["weapon_type.bow"] },
  { name: "Anti-Barrier Scout Rifle", hash: 2081977513, requiredTraidIds: ["weapon_type.scout_rifle"] },
  { name: "Unstoppable Glaive", hash: 1861426412, requiredTraidIds: ["weapon_type.glaive"] },
  { name: "Unstoppable Hand Cannon", hash: 2081977515, requiredTraidIds: ["weapon_type.hand_cannon"] },
  { name: "Unstoppable Pulse Rifle", hash: 2081977517, requiredTraidIds: ["weapon_type.pulse_rifle"] },
  { name: "Inferno Whip", hash: 1861426408, requiredEnergyTypes: [DestinyEnergyType.Thermal] },
  { name: "Overload Rounds", hash: 2081977514, requiredTraidIds: ["weapon_type.auto_rifle", "weapon_type.submachinegun"] },
  { name: "Overload Grenades", hash: 1861426409, requiredEnergyTypes: [DestinyEnergyType.Void] },
];

const isChampionMod = (mod: DestinyInventoryItemDefinition) => /^(Unstoppable|Anti-Barrier|Overload|InfernoWhip)/.test(mod.displayProperties.name);

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