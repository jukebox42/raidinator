const isRaidMod = (mod: any) => mod.displayProperties &&
                                /enhancements.raid/.test(mod.plug.plugCategoryIdentifier) &&
                                mod.displayProperties.name !== "Empty Mod Socket";

/**
 * Filter mods array down to mods that are raid mods
 */
export const getRaidMods = (mods: any[]) => mods.filter(m => isRaidMod(m));
