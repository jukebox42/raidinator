import { DestinyDisplayPropertiesDefinition } from "./Destiny/Definitions/Common";

/**
 * Generics
 */
export interface Table {
  [hash: number]: any
}

export interface Data {
  [table: number]: Table;
}

/**
 * DestinyEnergyTypes
 */
export interface DestinyEnergyType {
  blacklisted: boolean;
  displayProperties: DestinyDisplayPropertiesDefinition;
  enumValue: number;
  hash: number;
  index: number;
  redacted: boolean;
  showIcon: boolean;
  transparentIconPath?: string;
}

/**
 * DestinyStats
 */
export interface DestinyStatType {
  aggregationType: number;
  blacklisted: boolean;
  displayProperties: DestinyDisplayPropertiesDefinition;
  hasComputedBlock: boolean;
  hash: number;
  index: number;
  interpolate: boolean;
  redacted: boolean;
  statCategory: number;
}

/**
 * DestinyPlugSets
 */
export interface DestinyPlugSetsType {
  displayProperties: DestinyDisplayPropertiesDefinition;
  reusablePlugItems: {
    currentCanRoll: boolean;
    plugItemHash: number;
  };
  isFakePlugSet: boolean;
  hash: number;
  index: number;
  redacted: boolean;
}