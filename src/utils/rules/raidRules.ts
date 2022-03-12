import { DestinyInventoryItemDefinition } from "../../bungie/interfaces/Destiny/Definitions";

const isRaidMod = (mod: DestinyInventoryItemDefinition) => mod.displayProperties &&
                                /enhancements.raid/.test(mod.plug.plugCategoryIdentifier) &&
                                mod.displayProperties.name !== "Empty Mod Socket";

/**
 * Filter mods array down to mods that are raid mods
 */
export const getRaidMods = (mods: DestinyInventoryItemDefinition[]) => mods.filter(m => isRaidMod(m));
