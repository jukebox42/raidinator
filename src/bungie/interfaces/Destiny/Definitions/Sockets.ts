import { DestinyDisplayPropertiesDefinition } from "./Common";

// https://bungie-net.github.io/multi/schema_Destiny-Definitions-Sockets-DestinyPlugSetDefinition.html#schema_Destiny-Definitions-Sockets-DestinyPlugSetDefinition
export interface DestinyPlugSetDefinition {
  displayProperties: DestinyDisplayPropertiesDefinition;
  reusablePlugItems: any; // dont care
  isFakePlugSet: boolean;
  hash: number;
  index: number;
  redacted: boolean;
}