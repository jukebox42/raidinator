import { DestinyColor } from "../Misc";
import { DestinyDisplayPropertiesDefinition } from "./Common";
import {
  DestinyPlugRuleDefinition,
  DestinyParentItemOverride,
  DestinyEnergyCapacityEntry,
  DestinyEnergyCostEntry,
} from "./Items";

export * as Common from "./Common";
export * as BreakerTypes from "./BreakerTypes";
export * as EnergyTypes from "./EnergyTypes";
export * as Sockets from "./Sockets";
export * as Items from "./Items";

/**
 * https://bungie-net.github.io/multi/schema_Destiny-Definitions-DestinyStatDefinition.html#schema_Destiny-Definitions-DestinyStatDefinition
 */
 export interface DestinyStatDefinition {
  displayProperties: DestinyDisplayPropertiesDefinition;
  aggregationType: number;
  blacklisted: boolean;
  hasComputedBlock: boolean;
  interpolate: boolean;
  statCategory: number;
  hash: number;
  index: number;
  redacted: boolean;
}

/**
 * https://bungie-net.github.io/multi/schema_Destiny-Definitions-DestinyClassDefinition.html#schema_Destiny-Definitions-DestinyClassDefinition
 */
export interface DestinyClassDefinition {
  classType: number;
  displayProperties: DestinyDisplayPropertiesDefinition;
  genderedClassNames: {[key: number]: string}
  genderedClassNamesByGenderHash: {[key: number]: string};
  mentorVendorHash?: number;
  hash: number;
  index: number;
  redacted: boolean;
}

/**
 * https://bungie-net.github.io/multi/schema_Destiny-Definitions-DestinyDamageTypeDefinition.html#schema_Destiny-Definitions-DestinyDamageTypeDefinition
 */
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

/**
 * https://bungie-net.github.io/multi/schema_Destiny-Definitions-DestinyItemSocketEntryPlugItemDefinition.html#schema_Destiny-Definitions-DestinyItemSocketEntryPlugItemDefinition
 */
export interface DestinyItemSocketEntryPlugItemDefinition {
  plugItemHash: number; // DestinyInventoryItemDefinition
}

/**
 * https://bungie-net.github.io/multi/schema_Destiny-Definitions-DestinyItemSocketEntryDefinition.html#schema_Destiny-Definitions-DestinyItemSocketEntryDefinition
 */
export interface DestinyItemSocketEntryDefinition {
  socketTypeHash: number; // Sockets.DestinySocketTypeDefinition
  singleInitialItemHash: number; // DestinyInventoryItemDefinition
  reusablePlugItems: DestinyItemSocketEntryPlugItemDefinition[];
  preventInitializationOnVendorPurchase: boolean;
  hidePerksInItemTooltip: boolean;
  plugSources: number;
  reusablePlugSetHash?: number;
  randomizedPlugSetHash?: number;
  defaultVisible: boolean;
}

/**
 * https://bungie-net.github.io/multi/schema_Destiny-Definitions-DestinyItemIntrinsicSocketEntryDefinition.html#schema_Destiny-Definitions-DestinyItemIntrinsicSocketEntryDefinition
 */
export interface DestinyItemIntrinsicSocketEntryDefinition {
  plugItemHash: number; // Sockets.DestinySocketTypeDefinition
  socketTypeHash: number; // DestinyInventoryItemDefinition
  defaultVisible: boolean;
}

/**
 * https://bungie-net.github.io/multi/schema_Destiny-Definitions-DestinyItemSocketCategoryDefinition.html#schema_Destiny-Definitions-DestinyItemSocketCategoryDefinition
 */
export interface DestinyItemSocketCategoryDefinition {
  socketCategoryHash: number; // Sockets.DestinySocketCategoryDefinition
  socketIndexes: number[];
}

/**
 * https://bungie-net.github.io/multi/schema_Destiny-Definitions-DestinyItemSocketBlockDefinition.html#schema_Destiny-Definitions-DestinyItemSocketBlockDefinition
 */
export interface DestinyItemSocketBlockDefinition {
  detail: string;
  socketEntries: DestinyItemSocketEntryDefinition[];
  intrinsicSockets: DestinyItemIntrinsicSocketEntryDefinition[];
  socketCategories: DestinyItemSocketCategoryDefinition[];

}

/**
 * https://bungie-net.github.io/multi/schema_Destiny-Definitions-DestinyInventoryBucketDefinition.html#schema_Destiny-Definitions-DestinyInventoryBucketDefinition
 */
export interface DestinyInventoryBucketDefinition {
  displayProperties: DestinyDisplayPropertiesDefinition;
  scope: number;
  category: number;
  bucketOrder: number;
  itemCount: number;
  location: number;
  hasTransferDestination: boolean;
  enabled: boolean;
  fifo: boolean;
  hash: number;
  index: number;
  redacted: boolean;
}

/**
 * https://bungie-net.github.io/multi/schema_Destiny-Definitions-DestinyItemTooltipNotification.html#schema_Destiny-Definitions-DestinyItemTooltipNotification
 */
export interface DestinyItemTooltipNotification {
  displayString: string;
  displayStyle: string;
}

/**
 * https://bungie-net.github.io/multi/schema_Destiny-Definitions-DestinyInventoryItemStatDefinition.html#schema_Destiny-Definitions-DestinyInventoryItemStatDefinition
 */
export interface DestinyInventoryItemStatDefinition {
  statHash: number;
  value: number;
  minimum: number;
  maximum: number;
  displayMaximum: boolean;
}

/**
 * https://bungie-net.github.io/multi/schema_Destiny-Definitions-DestinyItemStatBlockDefinition.html#schema_Destiny-Definitions-DestinyItemStatBlockDefinition
 */
export interface DestinyItemStatBlockDefinition {
  disablePrimaryStatDisplay: boolean;
  statGroupHash: number;
  stats: DestinyInventoryItemStatDefinition;
  hasDisplayableStats: boolean;
  primaryBaseStatHash: number;
}

/**
 * https://bungie-net.github.io/multi/schema_Destiny-Definitions-Items-DestinyItemPlugDefinition.html#schema_Destiny-Definitions-Items-DestinyItemPlugDefinition
 */
export interface DestinyItemPlugDefinition {
  insertionRules: DestinyPlugRuleDefinition[];
  plugCategoryIdentifier: string;
  plugCategoryHash: number;
  onActionRecreateSelf: boolean;
  insertionMaterialRequirementHash: number;
  previewItemOverrideHash: number;
  enabledMaterialRequirementHash: number;
  enabledRules: DestinyPlugRuleDefinition[];
  uiPlugLabel: string;
  plugStyle: number;
  plugAvailability: number;
  alternateUiPlugLabel: string;
  alternatePlugStyle: number;
  isDummyPlug: boolean;
  parentItemOverride: DestinyParentItemOverride;
  energyCapacity: DestinyEnergyCapacityEntry;
  energyCost: DestinyEnergyCostEntry;
}

/**
 * https://bungie-net.github.io/multi/schema_Destiny-Definitions-DestinyItemSocketBlockDefinition.html#schema_Destiny-Definitions-DestinyItemSocketBlockDefinition
 */
export interface DestinyItemSocketBlockDefinition {
  detail: string;
  socketEntries: DestinyItemSocketEntryDefinition[];
  intrinsicSockets: DestinyItemIntrinsicSocketEntryDefinition[];
  socketCategories: DestinyItemSocketCategoryDefinition[];
}

/**
 * https://bungie-net.github.io/multi/schema_Destiny-Definitions-DestinyItemSummaryBlockDefinition.html#schema_Destiny-Definitions-DestinyItemSummaryBlockDefinition
 */
export interface DestinyItemSummaryBlockDefinition {
  sortPriority: number;
}

/**
 * https://bungie-net.github.io/multi/schema_Destiny-Definitions-DestinyItemTalentGridBlockDefinition.html#schema_Destiny-Definitions-DestinyItemTalentGridBlockDefinition
 */
export interface DestinyItemTalentGridBlockDefinition {
  talentGridHash: number;
  itemDetailString: string;
  buildName: string;
  hudDamageType: number;
  hudIcon: number;
}

/**
 * https://bungie-net.github.io/multi/schema_Destiny-Definitions-DestinyItemPerkEntryDefinition.html#schema_Destiny-Definitions-DestinyItemPerkEntryDefinition
 */
export interface DestinyItemPerkEntryDefinition {
  requirementDisplayString: string;
  perkHash: number;
  perkVisibility: number;
}

/**
 * https://bungie-net.github.io/multi/schema_Destiny-Definitions-DestinyInventoryItemDefinition.html#schema_Destiny-Definitions-DestinyInventoryItemDefinition
 */
export interface DestinyInventoryItemDefinition {
  displayProperties: DestinyDisplayPropertiesDefinition;
  tooltipNotifications: DestinyItemTooltipNotification[];
  collectibleHash: number | null;
  iconWatermark: string;
  iconWatermarkShelved: string;
  secondaryIcon: string;
  secondaryOverlay: string;
  secondarySpecial: string;
  backgroundColor: DestinyColor;
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
  stats: DestinyItemStatBlockDefinition;
  emblemObjectiveHash: number | null;
  equippingBlock: any;
  translationBlock: any;
  preview: any;
  quality: any;
  value: any;
  sourceData: any;
  objectives: any;
  metrics: any;
  plug: DestinyItemPlugDefinition;
  gearset: any;
  sack: any;
  sockets: DestinyItemSocketBlockDefinition;
  summary: DestinyItemSummaryBlockDefinition;
  talentGrid: DestinyItemTalentGridBlockDefinition;
  investmentStats: any[];
  perks: DestinyItemPerkEntryDefinition[];
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

/**
 * https://bungie-net.github.io/multi/schema_Destiny-Definitions-DestinyTalentNodeStepGroups.html#schema_Destiny-Definitions-DestinyTalentNodeStepGroups
 */
export interface DestinyTalentNodeStepGroups {
  weaponPerformance: number;
  impactEffects: number;
  guardianAttributes: number;
  lightAbilities: number;
  damageTypes: number;
}

/**
 * https://bungie-net.github.io/multi/schema_Destiny-Definitions-DestinySandboxPerkDefinition.html#schema_Destiny-Definitions-DestinySandboxPerkDefinition
 */
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

/**
 * https://bungie-net.github.io/multi/schema_Destiny-Definitions-DestinyNodeActivationRequirement.html#schema_Destiny-Definitions-DestinyNodeActivationRequirement
 */
export interface DestinyNodeActivationRequirement {
  gridLevel: number;
  materialRequirementHashes: number[];
}

/**
 * https://bungie-net.github.io/multi/schema_Destiny-Definitions-DestinyNodeSocketReplaceResponse.html#schema_Destiny-Definitions-DestinyNodeSocketReplaceResponse
 */
export interface DestinyNodeSocketReplaceResponse {
  socketTypeHash: number;
  plugItemHash: number;
}

/**
 * https://bungie-net.github.io/multi/schema_Destiny-Definitions-DestinyNodeStepDefinition.html#schema_Destiny-Definitions-DestinyNodeStepDefinition
 */
export interface DestinyNodeStepDefinition {
  displayProperties: DestinyDisplayPropertiesDefinition;
  stepIndex: number;
  nodeStepHash: number;
  interactionDescription: string;
  damageType: number;
  damageTypeHash?: number;
  activationRequirement: DestinyNodeActivationRequirement;
  canActivateNextStep: boolean;
  nextStepIndex: number;
  isNextStepRandom: boolean;
  perkHashes: number[];
  startProgressionBarAtProgress: number;
  statHashes: number[];
  affectsQuality: boolean;
  stepGroups: DestinyTalentNodeStepGroups;
  affectsLevel: boolean;
  socketReplacements: DestinyNodeSocketReplaceResponse;
}

/**
 * https://bungie-net.github.io/multi/schema_Destiny-Definitions-DestinyTalentNodeDefinition.html#schema_Destiny-Definitions-DestinyTalentNodeDefinition
 */
export interface DestinyTalentNodeDefinition {
  nodeIndex: number;
  nodeHash: number;
  row: number;
  column: number;
  prerequisiteNodeIndexes: number[];
  binaryPairNodeIndex: number;
  autoUnlocks: boolean;
  lastStepRepeats: boolean;
  isRandom: boolean;
  randomActivationRequirement: DestinyNodeActivationRequirement;
  isRandomRepurchasable: boolean;
  steps: DestinyNodeStepDefinition[];
  exclusiveWithNodeHashes: number[];
  randomStartProgressionBarAtProgression: number[];
  layoutIdentifier: string;
  groupHash?: number;
  loreHash?: number;
  nodeStyleIdentifier: number;
  ignoreForCompletion: boolean;
}

/**
 * https://bungie-net.github.io/multi/schema_Destiny-Definitions-DestinyTalentNodeExclusiveSetDefinition.html#schema_Destiny-Definitions-DestinyTalentNodeExclusiveSetDefinition
 */
export interface DestinyTalentNodeExclusiveSetDefinition {
  nodeIndexes: number[];
}

/**
 * https://bungie-net.github.io/multi/schema_Destiny-Definitions-DestinyTalentExclusiveGroup.html#schema_Destiny-Definitions-DestinyTalentExclusiveGroup
 */
export interface DestinyTalentExclusiveGroup {
  groupHash: number;
  loreHash: number;
  nodeHashes: number[];
  opposingGroupHashes: number[];
  opposingNodeHashes: number[];
}

/**
 * https://bungie-net.github.io/multi/schema_Destiny-Definitions-DestinyTalentNodeCategory.html#schema_Destiny-Definitions-DestinyTalentNodeCategory
 */
export interface DestinyTalentNodeCategory {
  identifier: string;
  isLoreDriven: boolean;
  displayProperties: DestinyDisplayPropertiesDefinition;
  nodeHashes: number[];
}

/**
 * https://bungie-net.github.io/multi/schema_Destiny-Definitions-DestinyTalentGridDefinition.html#schema_Destiny-Definitions-DestinyTalentGridDefinition
 */
export interface DestinyTalentGridDefinition {
  maxGridLevel: number;
  gridLevelPerColumn: number;
  progressionHash: number;
  nodes: DestinyTalentNodeDefinition[]
  exclusiveSets: DestinyTalentNodeExclusiveSetDefinition[];
  independentNodeIndexes: number[]
  groups: DestinyTalentExclusiveGroup;
  nodeCategories: DestinyTalentNodeCategory[];
  hash: number;
  index: number
  redacted: boolean;
}

/**
 * https://bungie-net.github.io/multi/schema_Destiny-Definitions-DestinyItemCategoryDefinition.html#schema_Destiny-Definitions-DestinyItemCategoryDefinition
 */
export interface DestinyItemCategoryDefinition {
  displayProperties: DestinyDisplayPropertiesDefinition;
  visible: boolean;
  deprecated: boolean;
  shortTitle: string;
  itemTypeRegex: string;
  grantDestinyBreakerType: number;
  plugCategoryIdentifier: string;
  itemTypeRegexNot: string;
  originBucketIdentifier: string;
  grantDestinyItemType: number;
  grantDestinySubType: number;
  grantDestinyClass: number;
  traitId: string;
  groupedCategoryHashes: number[];
  parentCategoryHashes: number[];
  groupCategoryOnly: boolean;
  hash: number;
  index: number;
  redacted: boolean;
}