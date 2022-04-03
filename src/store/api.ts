// This file isn't great. rewrite
import db from "store/db";
import {
  getProfile,
  getManifest as getBungieManifest,
  findPlayers as findBungiePlayers,
} from "bungie/api";

/**
 * Get the manifest endpoint. this tells us the version and where to get the data
 * @returns 
 */
export const getManifest = async () => {
  const response = await getBungieManifest();
  const error = {
    errorCode: response.ErrorCode, // response.ErrorCode
    errorStatus: response.ErrorStatus, // response.ErrorStatus
    message: response.Message, //response.Message
  };

  return { data: response.Response, error };
}

/**
 * Search for players by name
 * @param name The name to search by
 * @param page The page number...
 * @returns 
 */
 export const findPlayers = async (name: string, page: number = 0) => {
  const response = await findBungiePlayers(name, page);
  const error = {
    errorCode: response.ErrorCode, // response.ErrorCode
    errorStatus: response.ErrorStatus, // response.ErrorStatus
    message: response.Message, //response.Message
  };

  return { data: response.Response, error };
}

/**
 * Get a character from the API
 * @param membershipId The membership ID of the user
 * @param membershipType The membership type of the user, see BungieMembershipType
 * @param ignoreCache Whether or not to ignore the results of indexeddb and call the api
 * @returns 
 */
export const getCharacters = async (membershipId: number, membershipType: number, ignoreCache: boolean = false) => {
  let characterId = await db.loadCharacterId(membershipId);
  const response = await getProfile(membershipId, membershipType);

  const error = {
    errorCode: response.ErrorCode,
    errorStatus: response.ErrorStatus,
    message: response.Message,
  };

  const data = {
    ...response.Response
  }

  // Handle loading when we dont have a character id picked.
  // TODO: Does this really belong here or have we violated the rule of potentially managing view state in an api
  // function? I dont know. think about it.
  if (characterId === 0 && data.characters.data &&  Object.keys(data.characters.data).length > 0) {
    const characters = data.characters.data;
    const sortedCharacterKeys = Object.keys(characters).sort((a: any, b: any) => {
      return (new Date(characters[a].dateLastPlayed) as any) +
            (new Date(characters[b].dateLastPlayed) as any);
    });
    characterId = characters[sortedCharacterKeys[0]].characterId;
    await db.setCharacterId(membershipId, characterId); // store the value so it's there on refresh and stuff
  }

  console.log("Loaded from API...", response);
  return { data, characterId, error, profileTransitoryData: data.profileTransitoryData };
}
