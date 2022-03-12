import { DestinyPlugSetDefinition } from "../Definitions/Sockets";

/**
 * https://bungie-net.github.io/multi/schema_Destiny-Components-PlugSets-DestinyPlugSetsComponent.html#schema_Destiny-Components-PlugSets-DestinyPlugSetsComponent
 */
export interface DestinyPlugSetsComponent {
  plugs: {
    [plugId: number]: DestinyPlugSetDefinition[];
  }
}