import { useState, createContext } from "react";

import { getCharacters } from "../store/api";
import db from "../store/db";

import { CharactersData } from "../utils/interfaces";

interface CharacterContextProviderProps {
  children?: JSX.Element;
  membershipId: number;
  membershipType: number;
}

type CharacterContextType = {
  characterId: number;
  lastRefresh: number;
  setLastRefresh: (refreshTime: number) => void;
  data?: CharactersData;
  loadData: (ignoreCache?: boolean) => Promise<void>;
  setCharacterId: (characterId: number) => void;
}

export const CharacterContext = createContext<CharacterContextType>({
  characterId: 0,
  lastRefresh: 0,
  setLastRefresh: () => {},
  loadData: () => Promise.resolve(),
  setCharacterId: () => Promise.resolve(),
});

const CharacterContextProvider = ({ children, membershipId, membershipType }: CharacterContextProviderProps) => {
  const [internalCharacterId, internalSetCharacterId] = useState(0);
  const [lastRefresh, setLastRefresh] = useState(0);
  const [data, setData] = useState<CharactersData | undefined>(undefined);

  const loadData = async (ignoreCache: boolean = false) => {
    const { data, characterId, error } = await getCharacters(membershipId, membershipType, ignoreCache);

    if (error.errorCode !== 1) {
      console.error("API Error", error.errorStatus);
      return;
    }

    if (internalCharacterId === 0) {
      internalSetCharacterId(characterId);
    }
    setData(data);
  };

  const setCharacterId = async (characterId: number) => {
    if (characterId === 0) {
      await db.AppPlayersSelectedCharacter.delete(membershipId.toString());
    } else {
      await db.AppPlayersSelectedCharacter.put(membershipId, characterId);
    }
    console.log("SETTING CGAR ID", characterId);
    internalSetCharacterId(characterId);
  } 

  return (
    <CharacterContext.Provider
      value={{
        data,
        loadData,
        characterId: internalCharacterId,
        setCharacterId,
        lastRefresh,
        setLastRefresh,
      }}>
      {children}
    </CharacterContext.Provider>
  );
}

export default CharacterContextProvider;
