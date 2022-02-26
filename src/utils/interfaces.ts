import { membershipType } from "../bungie/enums";
import * as BI from "../bungie/interfaces";

export interface PlayerData {
  bungieGlobalDisplayName: string;
  bungieGlobalDisplayNameCode: number | null;
  iconPath: string;
  membershipType: membershipType;
  membershipId: number;
}

export interface GuardianData {
  character: BI.Destiny.Entities.Characrers.DestinyCharacterComponent;
  inventory: BI.Destiny.Entities.Inventory.DestinyInventoryComponent;
  itemComponents: BI.Destiny.Entities.Items.DestinyItemComponentSet;
  characterPlugSets: BI.Destiny.Components.PlugSets.DestinyPlugSetsComponent;
}