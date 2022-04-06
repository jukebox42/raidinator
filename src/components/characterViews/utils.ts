import { DestinyCharacterComponent } from "bungie/interfaces/Destiny/Entities/Characters";

/**
 * Get the ID of the last online character.
 */
export const lastOnlineCharacterId = (characters: { [id: number]: DestinyCharacterComponent }) => {
  const sortedCharacterKeys = Object.keys(characters).sort((a: any, b: any) => {
    return (new Date(characters[a].dateLastPlayed) as any) -
          (new Date(characters[b].dateLastPlayed) as any);
  });
  if (sortedCharacterKeys.length === 0) {
    return "0";
  }
  const lastid = sortedCharacterKeys[sortedCharacterKeys.length - 1];
  return lastid;
}
