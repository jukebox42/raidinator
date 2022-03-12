import { DestinyDisplayPropertiesDefinition } from "./Common";

/**
 * https://bungie-net.github.io/multi/schema_Destiny-Definitions-BreakerTypes-DestinyBreakerTypeDefinition.html#schema_Destiny-Definitions-BreakerTypes-DestinyBreakerTypeDefinition
 */
export interface DestinyBreakerTypeDefinition {
  displayProperties: DestinyDisplayPropertiesDefinition;
  enumValue: number;
  hash: number;
  index: number;
  redacted: boolean;
}