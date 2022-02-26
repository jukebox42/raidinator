// https://bungie-net.github.io/multi/schema_Destiny-Definitions-Common-DestinyIconSequenceDefinition.html#schema_Destiny-Definitions-Common-DestinyIconSequenceDefinition
export interface DestinyIconSequenceDefinition {
  frames: string[];
}

// https://bungie-net.github.io/multi/schema_Destiny-Definitions-Common-DestinyDisplayPropertiesDefinition.html#schema_Destiny-Definitions-Common-DestinyDisplayPropertiesDefinition
export interface DestinyDisplayPropertiesDefinition {
  description: string;
  hasIcon: boolean;
  highResIcon: string;
  icon: string;
  iconSequences: DestinyIconSequenceDefinition[];
  name: string;
}