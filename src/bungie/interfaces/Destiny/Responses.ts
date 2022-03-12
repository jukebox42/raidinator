import { DataCollection, DataSingle } from "../Dictionaries";
import { DestinyCharacterComponent } from "./Entities/Characters";
import { DestinyInventoryComponent } from "./Entities/Inventory";
import { DestinyItemComponent, DestinyItemComponentSet, DestinyItemInstanceComponent, DestinyItemStatsComponent, DestinyItemSocketsComponent } from "./Entities/Items";
import { DestinyProfileTransitoryComponent } from "./Components/Profiles";
import { DestinyPlugSetsComponent } from "./Components/PlugSets";


/**
 * https://bungie-net.github.io/multi/schema_Destiny-Responses-DestinyProfileResponse.html#schema_Destiny-Responses-DestinyProfileResponse
 */
export interface DestinyProfileResponse {
  characters: DataCollection<DestinyCharacterComponent>;
  characterEquipment: DataCollection<DestinyInventoryComponent>;
  itemComponents: DestinyItemComponentSet;
  characterPlugSets: DataCollection<DestinyPlugSetsComponent>;
  profileTransitoryData: DataSingle<DestinyProfileTransitoryComponent>;
};

/**
 * https://bungie-net.github.io/multi/schema_Destiny-Responses-DestinyItemResponse.html#schema_Destiny-Responses-DestinyItemResponse
 */
export interface DestinyItemResponse {
  characterId: number;
  item: DataCollection<DestinyItemComponent>;
  instance: DataCollection<DestinyItemInstanceComponent>;
  stats: DataCollection<DestinyItemStatsComponent>;
  sockets: DataCollection<DestinyItemSocketsComponent>;
}
