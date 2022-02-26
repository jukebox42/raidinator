import {ASSET_URL} from "./constants";

/**
 * Generates an asset url. the apu returns path to icons, this prepends the
 * domain. Overkill? maybe.
 */
export const getAssetUrl = (path: string): string => {
  return `${ASSET_URL}${path}`;
};
