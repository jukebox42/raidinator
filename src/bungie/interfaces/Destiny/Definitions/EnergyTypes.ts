import { DestinyDisplayPropertiesDefinition } from "./Common";

/**
 * https://bungie-net.github.io/multi/schema_Destiny-Definitions-EnergyTypes-DestinyEnergyTypeDefinition.html#schema_Destiny-Definitions-EnergyTypes-DestinyEnergyTypeDefinition
 */
export interface DestinyEnergyTypeDefinition {
  displayProperties: DestinyDisplayPropertiesDefinition;
  transparentIconPath: string;
  showIcon: boolean;
  enumValue: number;
  capacityStatHash: number;
  costStatHash: number;
  hash: number;
  index: number;
  redacted: boolean;
}