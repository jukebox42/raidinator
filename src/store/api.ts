import db from "../store/db";
import { getProfile } from "../bungie/api";

/**
 * Get a character from the API
 * @param membershipId The membership ID of the user
 * @param membershipType The membership type of the user, see BungieMembershipType
 * @param ignoreCache Whether or not to ignore the results of indexeddb and call the api
 * @returns 
 */
export const getCharacters = async (membershipId: number, membershipType: number, ignoreCache: boolean = false) => {
  // TODO: handleResponse needs to pass back errors for now empty them out
  const error = {
    errorCode: 1, // response.ErrorCode
    errorStatus: "Success", // response.ErrorStatus
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

      return { data, characterId, error }
    }
    console.log("DB was incomplete, fetching from API");
  }


  const response = await getProfile(membershipId, membershipType);
  const characterId = 0;
  const data = {
    ...response, // response.Response
  }

  console.log("Loaded from API...", response);
  if (error.errorCode === 1) {
    // Store/overwrite in DB
    await db.AppCharacters.put(data.characters, membershipId);
    await db.AppCharacterEquipment.put(data.characterEquipment, membershipId);
    await db.AppItemComponents.put(data.itemComponents, membershipId);
    await db.AppCharacterPlugSets.put(data.characterPlugSets, membershipId);
  }

  return { data, characterId, error };
}