// https://bungie-net.github.io/multi/schema_GroupsV2-GroupUserInfoCard.html#schema_GroupsV2-GroupUserInfoCard
export interface GroupUserInfoCard {
  LastSeenDisplayName: string;
  LastSeenDisplayNameType: number;
  supplementalDisplayName: string;
  iconPath: string;
  crossSaveOverride: number;
  applicableMembershipTypes: number[];
  isPublic: boolean;
  membershipType: number;
  membershipId: number;
  displayName: string;
  bungieGlobalDisplayName: string;
  bungieGlobalDisplayNameCode: number | null;
}