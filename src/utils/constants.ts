import { createTheme } from "@mui/material";

export const VERSION = "0.0.13b";

// API
export const DEV_MODE = process.env.NODE_ENV === "development";
let key = DEV_MODE ? process.env.REACT_APP_DEV_API_KEY : process.env.REACT_APP_API_KEY;
if (!key) {
  throw new Error("Missing .env file for API key. See .envExample")
}
export const API_KEY = key;

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
export const LIGHT_GG_URL = "https://www.light.gg/db/items/";
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

export const specialDamageMods = [
  "Suppressing Glave",
  "Suppressive Darkness",
];

// Misc

/**
 * This is the hash of the light stat. Used to pull it out of the list.
 */
export const LIGHT_STAT_HASH = "1935470627";

// MUI Theme
export const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#10131C",
    },
    secondary: {
      main: "#FFF",
    },
    divider: "#FFF",
  },
  components: {
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          background: "rgba(0, 0, 0, 0.90)",
          padding: "5px",
        },
        arrow: {
          color: "rgba(0, 0, 0, 0.90)",
        }
      }
    }
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