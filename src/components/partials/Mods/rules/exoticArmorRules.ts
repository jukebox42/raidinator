import { DestinyInventoryItemDefinition } from "bungie/interfaces/Destiny/Definitions";

const isExoticArmorMod = (mod: DestinyInventoryItemDefinition) => {
  return mod.itemTypeDisplayName === "Intrinsic" && !/\sFrame$/.test(mod.displayProperties.name);
}

/**
 * Filter mods array down to mods that are exotic properties
 */
 export const getExoticArmorMods = (mods: DestinyInventoryItemDefinition[]) => mods.filter(m => isExoticArmorMod(m));