import { useState, createContext } from "react";

import { getCharacters } from "../store/api";

import { CharactersData } from "../utils/interfaces";

interface CharacterContextProviderProps {
  children?: JSX.Element;
  membershipId: number;
  membershipType: number;
}

type ICharacterContextType = {
  characterId: number;
  data?: CharactersData;
  loadData: (ignoreCache?: boolean) => Promise<void>;
  setCharacterId: (characterId: number) => void;
}

export const CharacterContext = createContext<ICharacterContextType>({
  characterId: 0,
  loadData: () => Promise.resolve(),
  setCharacterId: () => Promise.resolve(),
});

const CharacterContextProvider = ({ children, membershipId, membershipType }: CharacterContextProviderProps) => {
  const [characterId, setCharacterId] = useState(0);
  const [data, setData] = useState<CharactersData | undefined>(undefined);

  const loadData = async (ignoreCache: boolean = false) => {
    // load from the API
    const { data, characterId, error } = await getCharacters(membershipId, membershipType, ignoreCache);

    if (error.errorCode !== 1) {
      console.error("API Error", error.errorStatus);
      return;
    }

    setData(data);
    setCharacterId(characterId);
  };

  return (
    <CharacterContext.Provider
      value={{
        data,
        loadData,
        characterId,
        setCharacterId,
      }}>
      {children}
    </CharacterContext.Provider>
  );
}

export default CharacterContextProvider;
