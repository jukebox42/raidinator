/**
 * https://bungie-net.github.io/multi/schema_Destiny-Definitions-Items-DestinyPlugRuleDefinition.html#schema_Destiny-Definitions-Items-DestinyPlugRuleDefinition
 */
export interface DestinyPlugRuleDefinition {
  failureMessage: string;
}

/**
 * https://bungie-net.github.io/multi/schema_Destiny-Definitions-Items-DestinyParentItemOverride.html#schema_Destiny-Definitions-Items-DestinyParentItemOverride
 */
export interface DestinyParentItemOverride {
  additionalEquipRequirementsDisplayStrings: string[];
  pipIcon: string;
}

/**
 * https://bungie-net.github.io/multi/schema_Destiny-Definitions-Items-DestinyEnergyCapacityEntry.html#schema_Destiny-Definitions-Items-DestinyEnergyCapacityEntry
 */
export interface DestinyEnergyCapacityEntry {
  capacityValue: number;
  energyTypeHash: number;
  energyType: number;
}

/**
 * https://bungie-net.github.io/multi/schema_Destiny-Definitions-Items-DestinyEnergyCostEntry.html#schema_Destiny-Definitions-Items-DestinyEnergyCostEntry
 */
export interface DestinyEnergyCostEntry {
  energyCost: number;
  energyTypeHash: number;
  energyType: number;
}