import { createTheme } from "@mui/material";

export const VERSION = "0.0.1b";

// API
export const DEV_MODE = false;
export const API_KEY =
  DEV_MODE ? process.env.REACT_APP_DEV_API_KEY : process.env.REACT_APP_API_KEY;

if (DEV_MODE) {
  console.log("---------------------");
  console.log("DEV MODE", DEV_MODE);
  console.log("---------------------");
}

// Lang
export const LANGUAGE = "en";

// URLS
export const SOURCE_URL = "https://github.com/jukebox42/raidinator";
export const ASSET_URL = "https://www.bungie.net";
export const API_URL = `${ASSET_URL}/platform`;
export const LASER_SOUNDS_URL =  `${ASSET_URL}/en/ClanV2/Index?groupId=221919`;
export const BUNGIE_API_URLS = {
  SEARCH_USER: `${API_URL}/User/Search/GlobalName/{page}/`,
  GET_USER_BY_ID: `${API_URL}/User/GetMembershipsById/{membershipId}/254/`,
}
export const PROFILE_COMPONENTS = [
  "Characters",
  "CharacterEquipment",
  "ItemInstances",
  "ItemSockets",
  "Transitory",
];
export const DESTINY_API_URLS = {
  GET_MANIFEST: `${API_URL}/Destiny2/Manifest/`,
  GET_PROFILE: `${API_URL}/Destiny2/{membershipType}/Profile/{destinyMembershipId}/?components=${PROFILE_COMPONENTS.join(",")}`,
}

// Special Mods
export const specialMods = [
  "Thermoclastic Strike",
  "Particle Deconstruction",
  "Protective Light",
];

// MUI Theme
export const theme = createTheme({
  palette: {
    primary: {
      main: "#463B3E",
    },
    secondary: {
      main: "#50453A",
    },
    background: {
      default: "#FBF6F0",
      paper: "#AD9B96",
    },
    // divider: "#463B3E",
  },
  shape: {
    borderRadius: 3,
  },
  spacing: 5,
  typography: {
    caption: {
      fontSize: "0.9rem",
    },
  },
})