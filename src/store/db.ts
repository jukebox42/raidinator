import Dexie, { Table } from "dexie";

import { PlayerData, AppSettings } from "utils/interfaces";

import * as BI from "bungie/interfaces";

/**
 * This list contains every destiny table from the manifest. The ones commented out this App doesn't need. See tables
 * in DB below as that list mirrors this one.
 */
export type ManifestTables = "DestinyNodeStepSummaryDefinition" |
                             //"DestinyArtDyeChannelDefinition" |
                             //"DestinyArtDyeReferenceDefinition" |
                             //"DestinyPlaceDefinition" |
                             "DestinyActivityDefinition" |
                             "DestinyActivityTypeDefinition" |
                             "DestinyClassDefinition" |
                             //"DestinyGenderDefinition" |
                             "DestinyInventoryBucketDefinition" |
                             //"DestinyRaceDefinition" |
                             "DestinyTalentGridDefinition" |
                             "DestinyUnlockDefinition" |
                             //"DestinyMaterialRequirementSetDefinition" |
                             "DestinySandboxPerkDefinition" |
                             "DestinyStatGroupDefinition" |
                             "DestinyProgressionMappingDefinition" |
                             //"DestinyFactionDefinition" |
                             //"DestinyVendorGroupDefinition" |
                             //"DestinyRewardSourceDefinition" |
                             //"DestinyUnlockValueDefinition" |
                             //"DestinyRewardMappingDefinition" |
                             //"DestinyRewardSheetDefinition" |
                             "DestinyItemCategoryDefinition" |
                             "DestinyDamageTypeDefinition" |
                             "DestinyActivityModeDefinition" |
                             //"DestinyMedalTierDefinition" |
                             //"DestinyAchievementDefinition" |
                             "DestinyActivityGraphDefinition" |
                             "DestinyActivityInteractableDefinition" |
                             "DestinyBondDefinition" |
                             //"DestinyCharacterCustomizationCategoryDefinition" |
                             //"DestinyCharacterCustomizationOptionDefinition" |
                             //"DestinyCollectibleDefinition" |
                             "DestinyDestinationDefinition" |
                             "DestinyEntitlementOfferDefinition" |
                             "DestinyEquipmentSlotDefinition" |
                             "DestinyStatDefinition" |
                             "DestinyInventoryItemDefinition" |
                             "DestinyInventoryItemLiteDefinition" |
                             "DestinyItemTierTypeDefinition" |
                             "DestinyLocationDefinition" |
                             //"DestinyLoreDefinition" |
                             "DestinyMetricDefinition" |
                             "DestinyObjectiveDefinition" |
                             "DestinyPlatformBucketMappingDefinition" |
                             "DestinyPlugSetDefinition" |
                             //"DestinyPowerCapDefinition" |
                             "DestinyPresentationNodeDefinition" |
                             "DestinyProgressionDefinition" |
                             "DestinyProgressionLevelRequirementDefinition" |
                             //"DestinyRecordDefinition" |
                             //"DestinyRewardAdjusterPointerDefinition" |
                             //"DestinyRewardAdjusterProgressionMapDefinition" |
                             //"DestinyRewardItemListDefinition" |
                             //"DestinySackRewardItemListDefinition" |
                             //"DestinySandboxPatternDefinition" |
                             //"DestinySeasonDefinition" |
                             //"DestinySeasonPassDefinition" |
                             "DestinySocketCategoryDefinition" |
                             "DestinySocketTypeDefinition" |
                             "DestinyTraitDefinition" |
                             "DestinyTraitCategoryDefinition" |
                             //"DestinyUnlockCountMappingDefinition" |
                             //"DestinyUnlockEventDefinition" |
                             //"DestinyUnlockExpressionMappingDefinition" |
                             //"DestinyVendorDefinition" |
                             "DestinyMilestoneDefinition" |
                             "DestinyActivityModifierDefinition" |
                             //"DestinyReportReasonCategoryDefinition" |
                             "DestinyArtifactDefinition" |
                             "DestinyBreakerTypeDefinition" |
                             "DestinyChecklistDefinition" |
                             "DestinyEnergyTypeDefinition";

class Db extends Dexie {
  AppSettings!: Table<AppSettings>;
  AppSearches!: Table<PlayerData>;
  AppPlayers!: Table<PlayerData>;
  AppPlayersSelectedCharacter!: Table<number>;
  AppManifestVersion!: Table<string>;

  // destiny
  DestinyNodeStepSummaryDefinition!: Table<any>;
  //DestinyArtDyeChannelDefinition!: Table<any>;
  //DestinyArtDyeReferenceDefinition!: Table<any>;
  //DestinyPlaceDefinition!: Table<any>;
  DestinyActivityDefinition!: Table<any>;
  DestinyActivityTypeDefinition!: Table<any>;
  DestinyClassDefinition!: Table<BI.Destiny.Definitions.DestinyClassDefinition>;
  //DestinyGenderDefinition!: Table<any>;
  DestinyInventoryBucketDefinition!: Table<BI.Destiny.Definitions.DestinyInventoryBucketDefinition>;
  //DestinyRaceDefinition!: Table<any>;
  DestinyTalentGridDefinition!: Table<BI.Destiny.Definitions.DestinyTalentGridDefinition>;
  DestinyUnlockDefinition!: Table<any>;
  //DestinyMaterialRequirementSetDefinition!: Table<any>;
  DestinySandboxPerkDefinition!: Table<any>;
  DestinyStatGroupDefinition!: Table<any>;
  DestinyProgressionMappingDefinition!: Table<any>;
  //DestinyFactionDefinition!: Table<any>;
  //DestinyVendorGroupDefinition!: Table<any>;
  //DestinyRewardSourceDefinition!: Table<any>;
  //DestinyUnlockValueDefinition!: Table<any>;
  //DestinyRewardMappingDefinition!: Table<any>;
  //DestinyRewardSheetDefinition!: Table<any>;
  DestinyItemCategoryDefinition!: Table<BI.Destiny.Definitions.DestinyItemCategoryDefinition>;
  DestinyDamageTypeDefinition!: Table<BI.Destiny.Definitions.DestinyDamageTypeDefinition>;
  DestinyActivityModeDefinition!: Table<any>;
  //DestinyMedalTierDefinition!: Table<any>;
  //DestinyAchievementDefinition!: Table<any>;
  DestinyActivityGraphDefinition!: Table<any>;
  DestinyActivityInteractableDefinition!: Table<any>;
  DestinyBondDefinition!: Table<any>;
  //DestinyCharacterCustomizationCategoryDefinition!: Table<any>;
  //DestinyCharacterCustomizationOptionDefinition!: Table<any>;
  //DestinyCollectibleDefinition!: Table<any>;
  DestinyDestinationDefinition!: Table<any>;
  DestinyEntitlementOfferDefinition!: Table<any>;
  DestinyEquipmentSlotDefinition!: Table<any>;
  DestinyStatDefinition!: Table<BI.Destiny.Definitions.DestinyStatDefinition>;
  DestinyInventoryItemDefinition!: Table<BI.Destiny.Definitions.DestinyInventoryItemDefinition>;
  DestinyInventoryItemLiteDefinition!: Table<any>;
  DestinyItemTierTypeDefinition!: Table<any>;
  DestinyLocationDefinition!: Table<any>;
  //DestinyLoreDefinition!: Table<any>;
  DestinyMetricDefinition!: Table<any>;
  DestinyObjectiveDefinition!: Table<any>;
  DestinyPlatformBucketMappingDefinition!: Table<any>;
  DestinyPlugSetDefinition!: Table<BI.Destiny.Definitions.Sockets.DestinyPlugSetDefinition>;
  //DestinyPowerCapDefinition!: Table<any>;
  DestinyPresentationNodeDefinition!: Table<any>;
  DestinyProgressionDefinition!: Table<any>;
  DestinyProgressionLevelRequirementDefinition!: Table<any>;
  //DestinyRecordDefinition!: Table<any>;
  //DestinyRewardAdjusterPointerDefinition!: Table<any>;
  //DestinyRewardAdjusterProgressionMapDefinition!: Table<any>;
  //DestinyRewardItemListDefinition!: Table<any>;
  //DestinySackRewardItemListDefinition!: Table<any>;
  //DestinySandboxPatternDefinition!: Table<any>;
  //DestinySeasonDefinition!: Table<any>;
  //DestinySeasonPassDefinition!: Table<any>;
  DestinySocketCategoryDefinition!: Table<BI.Destiny.Definitions.Sockets.DestinySocketCategoryDefinition>;
  DestinySocketTypeDefinition!: Table<BI.Destiny.Definitions.Sockets.DestinySocketTypeDefinition>;
  DestinyTraitDefinition!: Table<any>;
  DestinyTraitCategoryDefinition!: Table<any>;
  //DestinyUnlockCountMappingDefinition!: Table<any>;
  //DestinyUnlockEventDefinition!: Table<any>;
  //DestinyUnlockExpressionMappingDefinition!: Table<any>;
  //DestinyVendorDefinition!: Table<any>;
  DestinyMilestoneDefinition!: Table<any>;
  DestinyActivityModifierDefinition!: Table<any>;
  //DestinyReportReasonCategoryDefinition!: Table<any>;
  DestinyArtifactDefinition!: Table<any>;
  DestinyBreakerTypeDefinition!: Table<BI.Destiny.Definitions.BreakerTypes.DestinyBreakerTypeDefinition>;
  DestinyChecklistDefinition!: Table<any>;
  DestinyEnergyTypeDefinition!: Table<BI.Destiny.Definitions.EnergyTypes.DestinyEnergyTypeDefinition>;

  constructor() {
    super("Manifest");
  }

  init() {
    // Do nothing if we're already open
    if (this.isOpen()) {
      return Promise.resolve();
    }

    this.version(2).stores({
      AppSettings: "",
      AppManifestVersion: "",
      // holds the most recent version of the destiny manifest, this tells us if we need to reload
      AppSearches: "",
      // holds the resent selections to make searching quicker
      AppPlayers: "",
      // holds the loaded players
      AppPlayersSelectedCharacter: "",
      // holds the id of the character the player selected

      // bungie manifest data
      DestinyNodeStepSummaryDefinition: "",
      //DestinyArtDyeChannelDefinition: "",
      //DestinyArtDyeReferenceDefinition: "",
      //DestinyPlaceDefinition: "",
      DestinyActivityDefinition: "",
      DestinyActivityTypeDefinition: "",
      DestinyClassDefinition: "",
      //DestinyGenderDefinition: "",
      DestinyInventoryBucketDefinition: "",
      //DestinyRaceDefinition: "",
      DestinyTalentGridDefinition: "",
      DestinyUnlockDefinition: "",
      //DestinyMaterialRequirementSetDefinition: "",
      DestinySandboxPerkDefinition: "",
      DestinyStatGroupDefinition: "",
      DestinyProgressionMappingDefinition: "",
      //DestinyFactionDefinition: "",
      //DestinyVendorGroupDefinition: "",
      //DestinyRewardSourceDefinition: "",
      //DestinyUnlockValueDefinition: "",
      //DestinyRewardMappingDefinition: "",
      //DestinyRewardSheetDefinition: "",
      DestinyItemCategoryDefinition: "",
      DestinyDamageTypeDefinition: "",
      DestinyActivityModeDefinition: "",
      //DestinyMedalTierDefinition: "",
      //DestinyAchievementDefinition: "",
      DestinyActivityGraphDefinition: "",
      DestinyActivityInteractableDefinition: "",
      DestinyBondDefinition: "",
      //DestinyCharacterCustomizationCategoryDefinition: "",
      //DestinyCharacterCustomizationOptionDefinition: "",
      //DestinyCollectibleDefinition: "",
      DestinyDestinationDefinition: "",
      DestinyEntitlementOfferDefinition: "",
      DestinyEquipmentSlotDefinition: "",
      DestinyStatDefinition: "",
      DestinyInventoryItemDefinition: "",
      DestinyInventoryItemLiteDefinition: "",
      DestinyItemTierTypeDefinition: "",
      DestinyLocationDefinition: "",
      //DestinyLoreDefinition: "",
      DestinyMetricDefinition: "",
      DestinyObjectiveDefinition: "",
      DestinyPlatformBucketMappingDefinition: "",
      DestinyPlugSetDefinition: "",
      //DestinyPowerCapDefinition: "",
      DestinyPresentationNodeDefinition: "",
      DestinyProgressionDefinition: "",
      DestinyProgressionLevelRequirementDefinition: "",
      //DestinyRecordDefinition: "",
      //DestinyRewardAdjusterPointerDefinition: "",
      //DestinyRewardAdjusterProgressionMapDefinition: "",
      //DestinyRewardItemListDefinition: "",
      //DestinySackRewardItemListDefinition: "",
      //DestinySandboxPatternDefinition: "",
      //DestinySeasonDefinition: "",
      //DestinySeasonPassDefinition: "",
      DestinySocketCategoryDefinition: "",
      DestinySocketTypeDefinition: "",
      DestinyTraitDefinition: "",
      DestinyTraitCategoryDefinition: "",
      //DestinyUnlockCountMappingDefinition: "",
      //DestinyUnlockEventDefinition: "",
      //DestinyUnlockExpressionMappingDefinition: "",
      //DestinyVendorDefinition: "",
      DestinyMilestoneDefinition: "",
      DestinyActivityModifierDefinition: "",
      //DestinyReportReasonCategoryDefinition: "",
      DestinyArtifactDefinition: "",
      DestinyBreakerTypeDefinition: "",
      DestinyChecklistDefinition: "",
      DestinyEnergyTypeDefinition: "",
    });

    return this.open();
  }

  /**
   * Load selected character id from the db. Returns 0 if they dont exist.
   * @param playerId aka membershipId
   * @returns 
   */
  async loadCharacterId (playerId: number): Promise<number> {
    const characterId = await db.AppPlayersSelectedCharacter.get(playerId);
    return characterId ? characterId : 0;
  }

  /**
   * Set(or replace) the character id to the selected db so it's used.
   * @param playerId aka membershipId
   */
  async setCharacterId (playerId: number, characterId: number): Promise<void> {
    await db.AppPlayersSelectedCharacter.put(characterId, playerId);
  }

  /**
   * Deletes the character id from the db.
   * @param playerId aka membershipId
   */
   async removeCharacterId (playerId: number): Promise<void> {
    await db.AppPlayersSelectedCharacter.delete(playerId);
  }

  /**
   * Add the player to the db so it's there for next time
   */
  async putSearchResult(playerData: PlayerData) {
    const count = await this.AppSearches.count();
    const coll = await this.AppSearches.toCollection();
    const keys = await coll.keys();
    // if the player is in the list don't re-add them.
    if (keys.includes(playerData.membershipId)) {
      return;
    }
    // only remember a few back.
    if (count >= 6) {
      this.AppSearches.delete(keys[0]);
    }
    this.AppSearches.add(playerData, playerData.membershipId);
  }

  /**
   * Delete the database, this is used as a purge action
   */
  async clearAllCache() {
    await this.delete();
  }

  /**
   * Remove a player from the db.
   */
  async deletePlayerCache(playerId: number) {
    const strPlayerId = playerId.toString(); // numbers are too long have to use a string
    await this.AppPlayers.delete(strPlayerId);
    await this.AppPlayersSelectedCharacter.delete(strPlayerId);
  }
}

const db = new Db();
export default db;
