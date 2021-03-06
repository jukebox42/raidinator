import {
  API_KEY,
  ASSET_URL,
  BUNGIE_API_URLS,
  DESTINY_API_URLS,
} from "utils/constants";

// Interfaces
import * as BI from "./interfaces/";

const headers: HeadersInit = {
  "X-API-Key": API_KEY,
  "Content-Type": "application/json"
};

const handleResponse = <T>(response: BI.Response<T>): T => {
  // TODO handle errors maybe?
  return response.Response;
}

export const getManifest = async () => {
  const ret = await fetch(
    DESTINY_API_URLS.GET_MANIFEST,
    {
      method: "GET",
      mode: "cors",
      headers,
    });

  return await ret.json() as BI.Response<BI.Destiny.Config.DestinyManifest>;
}

export const getManifestContent = async (path: string): Promise<BI.Data> => {
  const ret = await fetch(
    `${ASSET_URL}/${path}`,
    {
      method: "GET",
      mode: "cors",
      redirect: "follow",
    });

  return ret.json();
}

export const findPlayers = async (name: string, page: number = 0) => {
  const data = {
    displayNamePrefix: name,
  };
  const ret = await fetch(
    BUNGIE_API_URLS.SEARCH_USER
      .replace("{page}", page.toString()),
    {
      method: "POST",
      mode: "cors",
      body: JSON.stringify(data),
      headers,
    });

  return await ret.json() as BI.Response<BI.User.UserSearchResponse>;
}

export const getProfile = async (id: number, type: number) => {
  const ret = await fetch(
    DESTINY_API_URLS.GET_PROFILE
      .replace("{membershipType}", type.toString())
      .replace("{destinyMembershipId}", id.toString()),
    {
      method: "GET",
      mode: "cors",
      headers,
    });

  return await ret.json() as BI.Response<BI.Destiny.Responses.DestinyProfileResponse>;
}

/**
 * TODO: rewrite this too. eventually.
 */
export const getMemberById = async (id: string) => {
  const ret = await fetch(
    BUNGIE_API_URLS.GET_USER_BY_ID
      .replace("{membershipId}", id.toString()),
    {
      method: "GET",
      mode: "cors",
      headers,
    });

  return handleResponse<BI.User.UserMembershipData>(await ret.json());
}