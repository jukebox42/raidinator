import { DestinyEnergyType } from "bungie/interfaces/Destiny";
import { DestinyInventoryItemDefinition } from "bungie/interfaces/Destiny/Definitions";

enum src {
  WEAPON = 1,
  EXPLOSIVE,
};

interface Generators {
  name: string;
  hash: number; // the mod type hash
  matchSubclass: boolean; // if the source and subclass need to match
  energy?: DestinyEnergyType; // the energy type this is generated. this is missing if it matches the subclass
  source?: src; // the source of the well generation, nothing means subclass abilities
  alwaysTrue?: boolean; // if the mod is always going to generate. denotes smething we can't really track well
}

interface Spenders {
  name: string;
  hash: number; // the mod type hash
  matchSubclass: boolean; // if the well type and subclass need to match
  energy?: DestinyEnergyType; // the well energy type that is needed. empty means any (see matchSubclass)
}

/**
 * TODO: Pull from database instead of hard code
 */
const chargers: Generators[] = [
  // === Artifact ===
  { name: "Melee Wellmaker", hash: 288409047, matchSubclass: true, },
  // === Rest ===
  { name: "Elemental Armaments", hash: 1515669996, matchSubclass: true, source: src.WEAPON, },
  { name: "Elemental Light", hash: 2823326549, matchSubclass: true, },
  { name: "Elemental Ordnance", hash: 1824486242, matchSubclass: true, },
  // TODO: stasis shards could come from anywhere so always show true
  { name: "Elemental Shards", hash: 1977242752, matchSubclass: false, energy: DestinyEnergyType.Stasis, alwaysTrue: true, },
  // TODO: this isn't tracked atm. will always show true
  { name: "Explosive Wellmaker", hash: 825650462, matchSubclass: false, source: src.EXPLOSIVE, energy: DestinyEnergyType.Thermal, alwaysTrue: true, },
  { name: "Melee Wellmaker", hash: 4213142382, matchSubclass: true, },
  { name: "Overcharge Wellmaker", hash: 3097132144, matchSubclass: false, energy: DestinyEnergyType.Arc, },
  { name: "Reaping Wellmaker", hash: 240958661, matchSubclass: false, energy: DestinyEnergyType.Void, },
  // TODO: this isn't properly tracked. will always show true
  { name: "Shieldcrash Wellmaker", hash: 1052528480, matchSubclass: false, energy: DestinyEnergyType.Void, alwaysTrue: true, },
  { name: "Supreme Wellmaker", hash: 1977242753, matchSubclass: false, energy: DestinyEnergyType.Stasis, },
];

const spenders: Spenders[] = [
  // === Artifact ===
  { name: "Font of Might", hash: 2119661524, matchSubclass: true, },
  { name: "Volatile Flow", hash: 2129265545, matchSubclass: false, energy: DestinyEnergyType.Void, },
  // === Rest ===
  { name: "Font of Might", hash: 1740246051, matchSubclass: true, },
  { name: "Font of Wisdom", hash: 1196831979, matchSubclass: true, },
  { name: "Well of Ions", hash: 1680735357, matchSubclass: false, energy: DestinyEnergyType.Arc, },
  { name: "Well of Life", hash: 2164090163, matchSubclass: false, energy: DestinyEnergyType.Thermal, },
  { name: "Well of Ordnance", hash: 4288515061, matchSubclass: false, energy: DestinyEnergyType.Thermal, },
  { name: "Well of Restoration", hash: 1977242755, matchSubclass: false, energy: DestinyEnergyType.Stasis, },
  { name: "Well of Striking", hash: 4044800076, matchSubclass: false, energy: DestinyEnergyType.Arc, },
  { name: "Well of Tenacity", hash: 3809244044, matchSubclass: false, energy: DestinyEnergyType.Void, },
  { name: "Well of Utility", hash: 1358633824, matchSubclass: false, energy: DestinyEnergyType.Void, },
];

const itemTypeDisplayName = "Elemental Well Mod";
const isWellMod = (mod: DestinyInventoryItemDefinition) => mod.itemTypeDisplayName === itemTypeDisplayName;

/**
 * Filter mods array down to mods that generate wells.
 */
export const getWellGeneratorMods = (mods: DestinyInventoryItemDefinition[]) => {
  return mods.filter(m => {
    return isWellMod(m) && chargers.find(c => c.hash === m.hash);
  });
};

/**
 * Filter mods array down to mods that spend wells.
 */
export const getWellSpenderMods = (mods: DestinyInventoryItemDefinition[]) => {
  return mods.filter(m => {
    return isWellMod(m) && spenders.find(s => s.hash === m.hash);
  });
}

/**
 * Check if a well mod's criteria is met.
 */
export const checkWellMod = (
  mod: DestinyInventoryItemDefinition,
  weaponEnergies: DestinyEnergyType[],
  subclassEnergy: DestinyEnergyType,
  wellEnergyTypes?: DestinyEnergyType[]
): DestinyEnergyType | boolean | null => {
  // this function only cares about wells
  if (!isWellMod(mod)) {
    return null;
  }

  const charger = chargers.find(m => m.hash === mod.hash);
  if (charger) {
    // can always create.
    if (charger.alwaysTrue) {
      if (charger.energy) {
        return charger.energy;
      }
      return subclassEnergy;
    }

    // if no source then it will always trigger and we just need to return the well type
    if (!charger.source) {
      if (charger.matchSubclass) {
        return subclassEnergy;
      }
      if (charger.energy) {
        return charger.energy;
      }
    }

    // if there is a soruce then see if we meet the requirements (this is only weapon, explosive i havent figured out)
    if (charger.source === src.WEAPON) {
      return weaponEnergies.includes(subclassEnergy) ? subclassEnergy : false;
    }

    console.error("Well mod failed to match charger criteria", mod);
    return null;
  }

  // If it's a mod that spends wells make sure it can
  const spender = spenders.find(m => m.hash === mod.hash);
  if (spender) {
    if (!wellEnergyTypes) {
      throw new Error("Must supply well creators list");
    }
    // check if we need to match the subclass and if we have any wells that are generated for that class
    if (spender.matchSubclass) {
      return wellEnergyTypes.includes(subclassEnergy);
    }

    // if the mod depends on a specific energy then make sure we can make it
    if (spender.energy) {
      return wellEnergyTypes.includes(spender.energy);
    }

    console.error("Well mod failed to match spender criteria", mod);
    return null;
  }

  console.error("FAILED TO FIND CHARGED WITH LIGHT MOD. MISSING FROM ARRAY", mod);
  return null;
}