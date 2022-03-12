import intersection from "lodash/intersection";

import { DestinyEnergyType } from "../../bungie/interfaces/Destiny";
import { DestinyInventoryItemDefinition } from "../../bungie/interfaces/Destiny/Definitions";

interface Chargers {
  name: string;
  hash: number; // the mod type hash
  sourceTraidIds?: string[]; // the source of the generation
  alwaysTrue?: boolean; // if the mod is always going to generate.
}

interface Spenders {
  name: string;
  hash: number; // the mod type hash
  useTraitIds?: string[]; // what spends it, trait ids
  useEnergy?: DestinyEnergyType; // what spends it energy
  alwaysTrue?: boolean; // if the mod has no unique spend(like requiring a weapon ect)
}

const chargers: Chargers[] = [
  // === Artifact ===

  // === Rest ===
  { name: "Blast Radius", hash: 3185435911, sourceTraidIds: ["weapon_type.rocket_launcher", "weapon_type.grenade_launcher"], },
  { name: "Charge Harvester", hash: 2263321587, alwaysTrue: true, },
  { name: "Empowered Finish", hash: 3632726236, alwaysTrue: true, },
  { name: "Precisely Charged", hash: 3523075122, sourceTraidIds: ["weapon_type.linear_fusion_rifle", "weapon_type.sniper_rifle"] },
  { name: "Precision Charge", hash: 2263321584, sourceTraidIds: ["weapon_type.bow", "weapon_type.hand_cannon", "weapon_type.scout_rifle"] },
  { name: "Quick Charge", hash: 1484685884, sourceTraidIds: ["weapon_type.fusion_rifle", "weapon_type.shotgun"] },
  { name: "Shield Break Charge", hash: 3632726239, alwaysTrue: true, },
  { name: "Sustained Charge", hash: 4272180933, sourceTraidIds: ["weapon_type.auto_rifle", "weapon_type.trace_rifle", "weapon_type.machine_gun"] },
  { name: "Swift Charge", hash: 2979815164, sourceTraidIds: ["weapon_type.pulse_rifle", "weapon_type.sidearm", "weapon_type.submachine_gun"] },
  { name: "Taking Charge", hash: 3632726238, alwaysTrue: true, },
];

const spenders: Spenders[] = [
  // === Artifact ===

  // === Rest ===
  { name: "Argent Ordnance", hash: 4272180932, useTraitIds: ["weapon_type.rocket_launcher"], },
  { name: "Energy Converter", hash: 2263321586, alwaysTrue: true },
  { name: "Extra Reserves", hash: 3523075121, useEnergy: DestinyEnergyType.Void },
  { name: "Firepower", hash: 3185435908, alwaysTrue: true },
  { name: "Heal Thyself", hash: 3185435909, alwaysTrue: true },
  { name: "Heavy Handed", hash: 1484685886, alwaysTrue: true },
  { name: "High-Energy Fire", hash: 3632726237, alwaysTrue: true },
  { name: "Kindling the Flame", hash: 4272180935, alwaysTrue: true },
  { name: "Lucent Blade", hash: 2979815165, useTraitIds: ["weapon_type.sword"] },
  { name: "Protective Light", hash: 3523075120, alwaysTrue: true },
  { name: "Reactive Pulse", hash: 2979815166, alwaysTrue: true },
  { name: "Striking Light", hash: 1484685885, alwaysTrue: true },
  { name: "Surprise Attack", hash: 2263321585, useTraitIds: ["weapon_type.sidearm"] },
];

const itemTypeDisplayName = "Charged with Light Mod";
const isChargedWithLightMod = (mod: DestinyInventoryItemDefinition) => mod.itemTypeDisplayName === itemTypeDisplayName;

/**
 * Filter mods array down to mods that generate charged with light.
 */
export const getChargedWithLightChargerMods = (mods: DestinyInventoryItemDefinition[]) => {
  return mods.filter(m => {
    return isChargedWithLightMod(m) && chargers.find(c => c.hash === m.hash);
  });
};

/**
 * Filter mods array down to mods that spend charged with light.
 */
export const getChargedWithLightSpenderMods = (mods: DestinyInventoryItemDefinition[]) => {
  return mods.filter(m => {
    return isChargedWithLightMod(m) && spenders.find(c => c.hash === m.hash);
  });
}

/**
 * Check if a charged with light mod's criteria is met.
 */
export const checkChargedWithLightMod = (
  mod: DestinyInventoryItemDefinition,
  weaponTypes: string[],
  weaponEnergies: DestinyEnergyType[],
  subclassEnergy: DestinyEnergyType
): boolean | null => {
  // this function only cares about charged with light
  if (!isChargedWithLightMod(mod)) {
    return null;
  }

  const charger = chargers.find(m => m.hash === mod.hash);
  if (charger) {
    // can always create.
    if (charger.alwaysTrue) {
      return true;
    }

    // check if weapons match(if the user has a weapon that is needed by a mod)
    if (charger.sourceTraidIds) {
      const matchingTraits = intersection(charger.sourceTraidIds, weaponTypes);
      return matchingTraits.length > 0;
    }
  }

  // If it's a mod that spends charged with light make sure it can
  const spender = spenders.find(m => m.hash === mod.hash);
  if (spender) {
    // can always spend.
    if (spender.alwaysTrue) {
      return true;
    }

    // check if weapons match(if the user has a weapon that is needed by a mod)
    if (spender.useTraitIds) {
      const matchingTraits = intersection(spender.useTraitIds, weaponTypes);
      return matchingTraits.length > 0;
    }

    // check if a required energy matches
    if (spender.useEnergy) {
      if (spender.useEnergy === subclassEnergy) {
        return true;
      }
      const hasMatchingEnergy = weaponEnergies.includes(spender.useEnergy);
      return hasMatchingEnergy;
    }
  }

  console.error("FAILED TO FIND CHARGED WITH LIGHT MOD. MISSING FROM ARRAY", mod);
  return null;
}