import intersection from "lodash/intersection";

import { DestinyInventoryItemDefinition } from "bungie/interfaces/Destiny/Definitions";

// TODO: can I get this from somewhere?
interface WeaponMap {
  [key: string]: string;
}

const weaponMap: WeaponMap = {
  "weapon_type.auto_rifle": "Auto Rifle",
  "weapon_type.bow": "Bow",
  "weapon_type.fusion_rifle": "Fusion Rifle",
  "weapon_type.glaive": "Glaive",
  "weapon_type.grenade_launcher": "Grenade Launcher",
  "weapon_type.hand_cannon": "Hand Cannon",
  "weapon_type.linear_fusion_rifle": "Linear Fusion Rifle",
  "weapon_type.machine_gun":  "Machine Gun",
  "weapon_type.pulse_rifle": "Pulse Rifle",
  "weapon_type.rocket_launcher": "Rocket Launcher",
  "weapon_type.scout_rifle": "Scout Rifle",
  "weapon_type.shotgun": "Shotgun",
  "weapon_type.sidearm": "Sidearm",
  "weapon_type.sniper_rifle": "Sniper Rifle",
  "weapon_type.sword": "Sword",
  "weapon_type.submachinegun": "Submachine Gun",
  "weapon_type.trace_rifle": "Trace Rifle",
};

const isAmmoFinderMod = (mod: DestinyInventoryItemDefinition) => mod.displayProperties &&
                                      /Ammo Finder$/.test(mod.displayProperties.name);

/**
 * Filter mods array down to mods that are ammo finder mods
 */
export const getAmmoFinderMods = (mods: DestinyInventoryItemDefinition[]) => mods.filter(m => isAmmoFinderMod(m));

/**
 * Check if an ammo finder mod's criteria is met.
 */
 export const checkAmmoFinderMod = (mod: DestinyInventoryItemDefinition, weaponTypes: string[]): boolean | null => {
  // this function only cares about champion mods
  if (!isAmmoFinderMod(mod)) {
    return null;
  }

  const weaponNames = intersection(Object.keys(weaponMap), weaponTypes).map((w: string) => weaponMap[w]);

  return !!weaponNames.find(w => mod.displayProperties.name.indexOf(w) === 0);
}
