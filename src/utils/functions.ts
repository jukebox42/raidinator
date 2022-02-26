import {ASSET_URL} from "./constants";

export const getAssetUrl = (path: string): string => {
  return `${ASSET_URL}${path}`;
};

export const getAssetUrlById = (id: number): string => {
  return `${ASSET_URL}/common/destiny2_content/icons/${id}.png`;
};
