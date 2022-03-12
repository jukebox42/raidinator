import { DestinyDisplayPropertiesDefinition } from "./Common";

/**
 * https://bungie-net.github.io/multi/schema_Destiny-Definitions-Sockets-DestinyPlugSetDefinition.html#schema_Destiny-Definitions-Sockets-DestinyPlugSetDefinition
 */
export interface DestinyPlugSetDefinition {
  displayProperties: DestinyDisplayPropertiesDefinition;
  reusablePlugItems: any; // dont care
  isFakePlugSet: boolean;
  hash: number;
  index: number;
  redacted: boolean;
}

/**
 * https://bungie-net.github.io/multi/schema_Destiny-Definitions-Sockets-DestinyInsertPlugActionDefinition.html#schema_Destiny-Definitions-Sockets-DestinyInsertPlugActionDefinition
 */
export interface DestinyInsertPlugActionDefinition {
  actionExecuteSeconds: number;
  actionType: number;
}

/**
 * https://bungie-net.github.io/multi/schema_Destiny-Definitions-Sockets-DestinyPlugWhitelistEntryDefinition.html#schema_Destiny-Definitions-Sockets-DestinyPlugWhitelistEntryDefinition
 */
export interface DestinyPlugWhitelistEntryDefinition {
  categoryHash: number;
  categoryIdentifier: string;
  reinitializationPossiblePlugHashes: number;
}

/**
 * https://bungie-net.github.io/multi/schema_Destiny-Definitions-Sockets-DestinySocketTypeScalarMaterialRequirementEntry.html#schema_Destiny-Definitions-Sockets-DestinySocketTypeScalarMaterialRequirementEntry
 */
export interface DestinySocketTypeScalarMaterialRequirementEntry {
  currencyItemHash: number;
  scalarValue: number;
}

/**
 * https://bungie-net.github.io/multi/schema_Destiny-Definitions-Sockets-DestinySocketTypeDefinition.html#schema_Destiny-Definitions-Sockets-DestinySocketTypeDefinition
 */
export interface DestinySocketTypeDefinition {
  displayProperties: DestinyDisplayPropertiesDefinition;
  insertAction: DestinyInsertPlugActionDefinition;
  plugWhitelist: DestinyPlugWhitelistEntryDefinition;
  socketCategoryHash: number;
  visibility: boolean;
  alwaysRandomizeSockets: boolean;
  isPreviewEnabled: boolean;
  hideDuplicateReusablePlugs: boolean;
  overridesUiAppearance: boolean;
  avoidDuplicatesOnInitialization: boolean;
  currencyScalars: DestinySocketTypeScalarMaterialRequirementEntry[];
  hash: number;
  index: number;
  redacted: boolean;
}

/**
 * https://bungie-net.github.io/multi/schema_Destiny-Definitions-Sockets-DestinySocketCategoryDefinition.html#schema_Destiny-Definitions-Sockets-DestinySocketCategoryDefinition
 */
export interface DestinySocketCategoryDefinition {
  displayProperties: DestinyDisplayPropertiesDefinition;
  uiCategoryStyle: number;
  categoryStyle: number;
  hash: number;
  index: number;
  redacted: boolean;
}