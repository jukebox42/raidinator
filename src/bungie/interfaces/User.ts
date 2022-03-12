import * as GroupsV2 from "./GroupsV2"

/**
 * https://bungie-net.github.io/multi/schema_User-UserToUserContext.html#schema_User-UserToUserContext
 */
export interface UserToUserContext {
  isFollowing: boolean;
  ignoreStatus: {
    isIgnored: boolean;
    ignoreFlags: number;
  }
  globalIgnoreEndDate: string;
}

/**
 * https://bungie-net.github.io/multi/schema_User-GeneralUser.html#schema_User-GeneralUser
 */
export interface GeneralUser {
  membershipId:  number;
  uniqueName:  string
  normalizedName:  string;
  displayName: string;
  profilePicture: number;
  profileTheme: number;
  userTitle: number;
  successMessageFlags: number;
  isDeleted: boolean
  about: string;
  firstAccess:  string| null;
  lastUpdate:  string | null;
  legacyPortalUID:  number | null;
  context: UserToUserContext;
  psnDisplayName: string;
  xboxDisplayName: string;
  fbDisplayName: string;
  showActivity: boolean;
  locale: string;
  localeInheritDefault: boolean
  lastBanReportId: number | null;
  showGroupMessaging: boolean;
  profilePicturePath: string;
  profilePictureWidePath: string;
  profileThemeName: string;
  userTitleDisplay: string;
  statusText: string;
  statusDate: string;
  profileBanExpire: string | null;
  blizzardDisplayName: string;
  steamDisplayName: string;
  stadiaDisplayName: string;
  twitchDisplayName: string;
  cachedBungieGlobalDisplayName: string;
  cachedBungieGlobalDisplayNameCode: number | null;
}

/**
 * https://bungie-net.github.io/multi/schema_User-UserMembershipData.html#schema_User-UserMembershipData
 */
export interface UserMembershipData {
  destinyMemberships: GroupsV2.GroupUserInfoCard[];
  primaryMembershipId: number;
  bungieNetUser: GeneralUser;
}

/**
 * https://bungie-net.github.io/multi/schema_User-UserInfoCard.html#schema_User-UserInfoCard
 */
export interface UserInfoCard {
  supplementalDisplayName: string;
  iconPath: string;
  crossSaveOverride: number;
  applicableMembershipTypes: number;
  isPublic: boolean;
  membershipType: number;
  membershipId: number;
  displayName: string;
  bungieGlobalDisplayName: string;
  bungieGlobalDisplayNameCode: number;
};

/**
 * https://bungie-net.github.io/multi/schema_User-UserSearchResponseDetail.html#schema_User-UserSearchResponseDetail
 */
export interface UserSearchResponseDetail {
  bungieGlobalDisplayName: string;
  bungieGlobalDisplayNameCode: number;
  bungieNetMembershipId: number;
  destinyMemberships: UserInfoCard[];
};

/**
 * https://bungie-net.github.io/multi/schema_User-UserSearchResponse.html#schema_User-UserSearchResponse
 */
export interface UserSearchResponse {
  searchResults: UserSearchResponseDetail[];
  page: number;
  hasMore: boolean;
};

/**
 * https://bungie-net.github.io/multi/schema_User-UserSearchPrefixRequest.html#schema_User-UserSearchPrefixRequest
 */
export interface UserSearchPrefixRequest {
  displayNamePrefix: string;
}