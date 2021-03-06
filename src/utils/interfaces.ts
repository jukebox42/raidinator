import * as BI from "bungie/interfaces";
import { DataCollection } from "bungie/interfaces/Dictionaries";
import * as Entities from "bungie/interfaces/Destiny/Entities";
import * as Components from "bungie/interfaces/Destiny/Components";
import { DestinyDisplayPropertiesDefinition } from "bungie/interfaces/Destiny/Definitions/Common";

export interface AppSettings {
  championMods: boolean;
  ammoMods: boolean;
  lightMods: boolean;
  wellMods: boolean;
  raidMods: boolean;
  specialMods: boolean;
}

/**
 * Data about a player
 */
export interface PlayerData {
  bungieGlobalDisplayName: string;
  bungieGlobalDisplayNameCode: number | null;
  iconPath: string;
  membershipType: BI.BungieMembershipType;
  membershipId: number;
}

/**
 * Represents all the data for a guardian
 */
export interface GuardianData {
  character: BI.Destiny.Entities.Characters.DestinyCharacterComponent;
  inventory: BI.Destiny.Entities.Inventory.DestinyInventoryComponent;
  itemComponents: BI.Destiny.Entities.Items.DestinyItemComponentSet;
  characterPlugSets: BI.Destiny.Components.PlugSets.DestinyPlugSetsComponent;
}

/**
 * The Guardians one is used to put data in indexeddb.
 * 
 * TO BE DELETED ONCE THE CONTEXT MOVE IS COMPLETE
 */
export interface GuardiansData {
  characterId: number;
  characters: DataCollection<Entities.Characters.DestinyCharacterComponent>;
  characterEquipment: DataCollection<Entities.Inventory.DestinyInventoryComponent>;
  itemComponents: Entities.Items.DestinyItemComponentSet;
  characterPlugSets: DataCollection<Components.PlugSets.DestinyPlugSetsComponent>;
}

/**
 * Used to put/get characters into/from the indexeddb.
 */
export interface CharactersData {
  characters: DataCollection<Entities.Characters.DestinyCharacterComponent>;
  characterEquipment: DataCollection<Entities.Inventory.DestinyInventoryComponent>;
  itemComponents: Entities.Items.DestinyItemComponentSet;
  characterPlugSets: DataCollection<Components.PlugSets.DestinyPlugSetsComponent>;
}

/**
 * A partial of the inventory item used for stats.
 * 
 * TODO: refactor display character to use this.
 */
export interface PartialDestinyInventoryItemDefinition {
  hash: number;
  talentGrid: {
    buildName: number;
  }
  displayProperties: DestinyDisplayPropertiesDefinition;
}