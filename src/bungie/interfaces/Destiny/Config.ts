// part of the manifest, I broke it out cause i needed it
export interface JsonWorldContentPaths {
  [definition: string]: string;
}

/**
 * https://bungie-net.github.io/multi/schema_Destiny-Config-DestinyManifest.html#schema_Destiny-Config-DestinyManifest
 */
export interface DestinyManifest {
  version: string;
  mobileAssetContentPath: string;
  mobileGearAssetDataBases: { version: number; path: string; }[];
  mobileWorldContentPaths: { [language: string]: string; };
  jsonWorldContentPaths: { [language: string]: string; };
  jsonWorldComponentContentPaths: {
    [language: string]: JsonWorldContentPaths;
  };
  mobileClanBannerDatabasePath: string;
  mobileGearCDN: { [key: string]: string };
  iconImagePyramidInfo: string[]
}