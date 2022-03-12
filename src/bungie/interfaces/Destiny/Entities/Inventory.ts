import { DestinyItemComponent } from "./Items"

/**
 * https://bungie-net.github.io/multi/schema_Destiny-Entities-Inventory-DestinyInventoryComponent.html#schema_Destiny-Entities-Inventory-DestinyInventoryComponent
 */
export interface DestinyInventoryComponent {
  items: DestinyItemComponent[];
}