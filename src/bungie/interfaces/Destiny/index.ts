export * as Components from "./Components";
export * as Definitions from "./Definitions";
export * as Entities from "./Entities";
export * as Config from "./Config";
export * as Misc from "./Misc";
export * as Responses from "./Responses";

/**
 * https://bungie-net.github.io/multi/schema_Destiny-DestinyClass.html#schema_Destiny-DestinyClass
 */
export enum DestinyClass {
  Titan = 0,
  Hunter = 1,
  Warlock = 2,
  Unknown = 3,
}

/**
 * https =//bungie-net.github.io/multi/schema_Destiny-DamageType.html#schema_Destiny-DamageType
 */
export enum DamageType {
  None = 0,
  Kinetic = 1,
  Arc = 2,
  Thermal = 3,
  Void = 4,
  Raid = 5,
  Stasis = 6,
}

/**
 * https =//bungie-net.github.io/multi/schema_Destiny-DestinyEnergyType.html#schema_Destiny-DestinyEnergyType
 */
export enum DestinyEnergyType {
  Any = 0,
  Arc = 1,
  Thermal = 2,
  Void = 3,
  Ghost = 4,
  Subclass = 5,
  Stasis = 6,
}

/**
 * https://bungie-net.github.io/multi/schema_Destiny-DestinyItemType.html#schema_Destiny-DestinyItemType
 * 
 * NOTE: might be incomplete;
 */
export enum DestinyItemType {
  None = 0,
  Currency = 1,
  Armor = 2,
  Weapon = 3,
  Message = 7,
  Engram = 8,
  Consumable = 9,
  ExchangeMaterial = 10,
  MissionReward = 11,
  QuestStep = 12,
  QuestStepComplete = 13,
  Emblem = 14,
  Quest = 15,
  Subclass = 16,
  ClanBanner = 17,
  Aura = 18,
  Mod = 19,
  Dummy = 20,
  Ship = 21,
  Vehicle = 22,
  Emote = 23,
  Ghost = 24,
  Package = 25,
  Bounty = 26,
  Wrapper = 27,
  SeasonalArtifact = 28,
  Finisher = 29,
}

/**
 * https://bungie-net.github.io/multi/schema_Destiny-DestinyBreakerType.html#schema_Destiny-DestinyBreakerType
 */
export enum DestinyBreakerType {
  None = 0,
  ShieldPiercing = 1,
  Disruption = 2,
  Stagger = 3,
}