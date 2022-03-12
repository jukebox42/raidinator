import { membershipType } from "./../../../enums";

/**
 * https://bungie-net.github.io/multi/schema_Destiny-Entities-Characters-DestinyCharacterComponent.html#schema_Destiny-Entities-Characters-DestinyCharacterComponent
 */
export interface DestinyCharacterComponent {
  membershipId: number;
  membershipType: membershipType;
  characterId: number;
  dateLastPlayed: any;
  minutesPlayedThisSession: number;
  minutesPlayedTotal: number;
  light: number;
  stats: { [key: number]: number };
  raceHash: number;
  genderHash: number;
  classHash: number;
  raceType: number;
  classType: number;
  genderType: number;
  emblemPath: string;
  emblemBackgroundPath: string;
  emblemHash: number;
  emblemColor: any;
  levelProgression: any;
  baseCharacterLevel: number;
  percentToNextLevel: number;
  titleRecordHash: number;
};