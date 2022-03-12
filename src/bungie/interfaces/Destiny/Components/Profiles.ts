/**
 * https://bungie-net.github.io/multi/schema_Destiny-Components-Profiles-DestinyProfileTransitoryPartyMember.html#schema_Destiny-Components-Profiles-DestinyProfileTransitoryPartyMember
 */
export interface DestinyProfileTransitoryPartyMember {
  membershipId: string;
  emblemHash: number;
  status: number;
}

/**
 * https://bungie-net.github.io/multi/schema_Destiny-Components-Profiles-DestinyProfileTransitoryComponent.html#schema_Destiny-Components-Profiles-DestinyProfileTransitoryComponent
 */
export interface DestinyProfileTransitoryComponent {
  partyMembers: DestinyProfileTransitoryPartyMember[];
  lastOrbitedDestinationHash: number;
  currentActivity: {
    highestOpposingFactionScore: number;
    numberOfOpponents: number;
    numberOfPlayers: number;
    score: number;
    startTime: string;
  };
  joinability: {
    closedReasons: number;
    openSlots: number;
    privacySetting: number;
  }
  tracking: any[];
}