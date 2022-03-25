import { useState, createContext, useContext } from "react";

import { getCharacters } from "../store/api";
import db from "../store/db";

import { CharactersData } from "../utils/interfaces";
import { AppContext } from "./AppContext";

interface CharacterContextProviderProps {
  children?: JSX.Element;
  membershipId: number;
  membershipType: number;
}

type CharacterContextType = {
  characterId: number;
  lastRefresh: number;
  error: string;
  setError: (error: string) => void;
  setLastRefresh: (refreshTime: number) => void;
  data?: CharactersData;
  loadData: (ignoreCache?: boolean) => Promise<void>;
  setCharacterId: (characterId: number) => void;
  getSelectedCharacterId: () => Promise<number>;
}

export const CharacterContext = createContext<CharacterContextType>({
  characterId: 0,
  lastRefresh: 0,
  error: "",
  setError: () => {},
  setLastRefresh: () => {},
  loadData: () => Promise.resolve(),
  setCharacterId: () => Promise.resolve(),
  getSelectedCharacterId: () => Promise.resolve(0),
});

const CharacterContextProvider = ({ children, membershipId, membershipType }: CharacterContextProviderProps) => {
  const appContext = useContext(AppContext);
  const [internalCharacterId, internalSetCharacterId] = useState(0);
  const [lastRefresh, setLastRefresh] = useState(0);
  const [error, setError] = useState("");
  const [data, setData] = useState<CharactersData | undefined>(undefined);

  const getSelectedCharacterId = async () => {
    const characterId = await db.AppPlayersSelectedCharacter.get(membershipId);
    return characterId ? characterId : 0;
  }

  const loadData = async (ignoreCache: boolean = false) => {
    setError(""); // clear error
    const { data, characterId, error } = await getCharacters(membershipId, membershipType, ignoreCache);

    if (error.errorCode !== 1) {
      const errorText = `Failed to load player: ${error.message}`;
      appContext.addToast(errorText, "error");
      setError(errorText);
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
      await db.AppPlayersSelectedCharacter.put(characterId, membershipId);
    }
    internalSetCharacterId(characterId);
  } 

  return (
    <CharacterContext.Provider
      value={{
        data,
        error,
        setError,
        loadData,
        getSelectedCharacterId,
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
