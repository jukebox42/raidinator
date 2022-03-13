import * as BI from "../bungie/interfaces";
import { DataCollection } from "../bungie/interfaces/Dictionaries";
import * as Entities from "../bungie/interfaces/Destiny/Entities";
import * as Components from "../bungie/interfaces/Destiny/Components";

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
 * The Guardians one is used to put data in indexeddb
 */
export interface GuardiansData {
  characterId: number | undefined;
  characters: DataCollection<Entities.Characters.DestinyCharacterComponent>;
  characterEquipment: DataCollection<Entities.Inventory.DestinyInventoryComponent>;
  itemComponents: Entities.Items.DestinyItemComponentSet;
  characterPlugSets: DataCollection<Components.PlugSets.DestinyPlugSetsComponent>;
}
