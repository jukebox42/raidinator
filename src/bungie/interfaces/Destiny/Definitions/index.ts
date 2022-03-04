import { DestinyDisplayPropertiesDefinition } from "./Common";

export * as Common from "./Common";
export * as Sockets from "./Sockets";

export interface DestinyDamageTypeDefinition {
  blacklisted: boolean;
  displayProperties: DestinyDisplayPropertiesDefinition;
  enumValue: number;
  hash: number;
  index: number;
  redacted: boolean;
  showIcon: boolean;
  transparentIconPath?: string;
}

// https://bungie-net.github.io/multi/schema_Destiny-Definitions-DestinyInventoryItemDefinition.html#schema_Destiny-Definitions-DestinyInventoryItemDefinition
export interface DestinyInventoryItemDefinition {
  displayProperties: DestinyDisplayPropertiesDefinition;
  tooltipNotifications: any[]; // dont care
  collectibleHash: number | null;
  iconWatermark: string;
  iconWatermarkShelved: string;
  secondaryIcon: string;
  secondaryOverlay: string;
  secondarySpecial: string;
  backgroundColor: any; // dont care
  screenshot: string;
  itemTypeDisplayName: string;
  flavorText: string;
  uiItemDisplayStyle: string;
  itemTypeAndTierDisplayName: string;
  displaySource: string;
  tooltipStyle: string;
  action: any;
  crafting: any;
  inventory: any;
  setData: any;
  stats: any;
  emblemObjectiveHash: number | null;
  equippingBlock: any;
  translationBlock: any;
  preview: any;
  quality: any;
  value: any;
  sourceData: any;
  objectives: any;
  metrics: any;
  plug: any;
  gearset: any;
  sack: any;
  sockets: any;
  summary: any;
  talentGrid: any;
  investmentStats: any[];
  perks: any;
  loreHash: number | null;
  summaryItemHash: number | null;
  animations: any[];
  allowActions: boolean;
  links: any;
  doesPostmasterPullHaveSideEffects: boolean;
  nonTransferrable: boolean;
  itemCategoryHashes: string[];
  specialItemType: number;
  itemType: number;
  itemSubType: number;
  classType: number;
  breakerType: number;
  breakerTypeHash: number | null;
  equippable: boolean;
  damageTypeHashes: number[];
  damageTypes: number[];
  defaultDamageType: number;
  defaultDamageTypeHash: number | null;
  seasonHash: number | null;
  isWrapper: boolean;
  traitIds: string[];
  traitHashes: number[];
  hash: number;
  index: number;
  redacted: boolean;
}

// https://bungie-net.github.io/multi/schema_Destiny-Definitions-DestinyTalentNodeStepGroups.html#schema_Destiny-Definitions-DestinyTalentNodeStepGroups
export interface DestinyTalentNodeStepGroups {
  weaponPerformance: number;
  impactEffects: number;
  guardianAttributes: number;
  lightAbilities: number;
  damageTypes: number;
}

// https://bungie-net.github.io/multi/schema_Destiny-Definitions-DestinySandboxPerkDefinition.html#schema_Destiny-Definitions-DestinySandboxPerkDefinition
export interface DestinySandboxPerkDefinition {
  displayProperties: DestinyDisplayPropertiesDefinition;
  perkIdentifier: string;
  isDisplayable: boolean;
  damageType: number;
  damageTypeHash: number;
  perkGroups: DestinyTalentNodeStepGroups;
  hash: number;
  index: number;
  redacted: boolean;
}