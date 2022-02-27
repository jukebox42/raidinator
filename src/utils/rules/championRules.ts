import intersection from "lodash/intersection";

enum EnergyType {
  VOID = 3,
  SOLAR = 2,
  ARC = 1,
  STASIS = 6,
};

interface ChampionModTypes {
  name: string;
  hash: number;
  requiredTraidIds?: string[];
  requiredEnergyTypes?: EnergyType[]; // this is subclass type
}

const championMods: ChampionModTypes[] = [
  // === Artifact ===
  { name: "Piercing Bowstring", hash: 2081977516, requiredTraidIds: ["weapon_type.bow"] },
  { name: "Anti-Barrier Scout Rifle", hash: 2081977513, requiredTraidIds: ["weapon_type.scout_rifle"] },
  { name: "Unstoppable Glaive", hash: 1861426412, requiredTraidIds: ["weapon_type.glave"] },
  { name: "Unstoppable Hand Cannon", hash: 2081977515, requiredTraidIds: ["weapon_type.hand_cannon"] },
  { name: "Unstoppable Pulse Rifle", hash: 2081977517, requiredTraidIds: ["weapon_type.pulse_rifle"] },
  { name: "Inferno Whip", hash: 1861426408, requiredEnergyTypes: [EnergyType.SOLAR] },
  { name: "Overload Rounds", hash: 2081977514, requiredTraidIds: ["weapon_type.auto_rifle", "weapon_type.submachine_gun"] },
  { name: "Overload Grenades", hash: 1861426409, requiredEnergyTypes: [EnergyType.VOID] },
];

const isChampionMod = (mod: any) => /^(Unstoppable|Anti-Barrier|Overload|InfernoWhip)/.test(mod.displayProperties.name);

/**
 * Filter mods array down to mods that are champion mods
 */
export const getChampionMods = (mods: any[]) => mods.filter(m => isChampionMod(m));

/**
 * Check if a charged with light mod's criteria is met.
 */
export const checkChampionMod = (mod: any, weaponTypes: string[], subclassEnergy: EnergyType): boolean | null => {
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