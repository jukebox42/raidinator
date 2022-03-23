import db from "../store/db";
import {
  getProfile,
  getManifest as getBungieManifest,
  findPlayers as findBungiePlayers,
} from "../bungie/api";


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
  const error = {
    errorCode: 1, // response.ErrorCode
    errorStatus: "Success", // response.ErrorStatus
    message: "Ok", //response.Message
  };

  if (!ignoreCache) {
    const dbResponse = await db.loadCharacter(membershipId);
    console.log("Loaded from DB...", dbResponse);
    if (
      dbResponse.data.characters && dbResponse.data.characterEquipment &&
      dbResponse.data.itemComponents && dbResponse.data.characterPlugSets
      // TODO: we should probably have a way to bust this cache, maybe a last loaded by player id?
    ) {
      const characterId = dbResponse.characterId ? dbResponse.characterId : 0;
      const data = {
        characters: dbResponse.data.characters,
        characterEquipment:  dbResponse.data.characterEquipment,
        itemComponents: dbResponse.data.itemComponents,
        characterPlugSets: dbResponse.data.characterPlugSets,
      }

      return { data, characterId, error, profileTransitoryData: {} as any }
    }
    console.log("DB was incomplete, fetching from API");
  }


  const response = await getProfile(membershipId, membershipType);
  error.errorCode = response.ErrorCode;
  error.errorStatus = response.ErrorStatus;
  error.message = response.Message

  const characterId = 0;
  const data = {
    ...response.Response
  }


  if (error.errorCode === 1) {
    // Store/overwrite in DB
    await db.AppCharacters.put(data.characters, membershipId);
    await db.AppCharacterEquipment.put(data.characterEquipment, membershipId);
    await db.AppItemComponents.put(data.itemComponents, membershipId);
    await db.AppCharacterPlugSets.put(data.characterPlugSets, membershipId);
  }

  return { data, characterId, error, profileTransitoryData: data.profileTransitoryData };
}