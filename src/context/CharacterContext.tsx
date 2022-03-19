import { useState, createContext } from "react";
import { v4 as uuid } from "uuid";
import clone from "lodash/clone";

import db from "../store/db";
import { getCharacters } from "../store/api";

import { CharactersData, PlayerData } from "../utils/interfaces";
import { Card } from "@mui/material";

// John you made this file to make a global context. where does player load? another context maybe? Guardian is loading the player today and that seems strange but maybe that's fine it doesn't matter if that still happens maybe?

interface CharacterContextProviderProps {
  children?: JSX.Element;
}

interface Card {
  membershipId: number;
  characterId: number;
  player: PlayerData;
  data?: CharactersData,
}

interface NewCard {
  membershipId: number;
  player: PlayerData;
}

interface ICharacterContext {
  cards: Card[],
  addCard: (membershipId: number, player: PlayerData) => void;
  replaceCards: (newCards: NewCard[]) => void;
  findCard: (membershipId: number) => Card | undefined;
  loadCardData: (membershipId: number, loadCardData?: boolean) => Promise<void>;
  deleteCard: (membershipId: number) => Promise<void>;
  setCardCharacterId: (membershipId: number, characterId: number) => Promise<void>;
}

export const CharacterContext = createContext<ICharacterContext>({
  cards: [],
  addCard: () => {},
  replaceCards: () => {},
  findCard: () => undefined,
  loadCardData: () => Promise.resolve(),
  deleteCard: () => Promise.resolve(),
  setCardCharacterId: () => Promise.resolve(),
});

export const CharacterContextProvider = ({ children }: CharacterContextProviderProps) => {
  const [cards, setCards] = useState<Card[]>([]);

  const replaceCards = async (newCards: any[] ) => {
    if(newCards.length > 6) {
      return;
    }

    const tempCards = newCards.map(c => { return {membershipId: c.membershipId, player: c.player, characterId: 0}});
    console.log("REPLACE CARDS", tempCards);
    setCards([...tempCards]);
  }

  const addCard = async (membershipId: number, player: PlayerData) => {
    if (cards.length === 6 || cards.find(c => c.membershipId === membershipId)) {
      return;
    }
    const characterId = 0;
    setCards([...cards, { membershipId, characterId, player }]);
  };

  const findCard = (membershipId: number) => {
    return cards.find(c => c.membershipId.toString() === membershipId.toString());
  }

  const loadCardData = async (membershipId: number, ignoreCache: boolean = false) => {
    const cardIndex = cards.findIndex(c => c.membershipId.toString() === membershipId.toString());
    if (cardIndex < 0) {
      return;
    }
    
    // load from the API
    const membershipType = cards[cardIndex].player.membershipType;
    const { data, characterId, error } = await getCharacters(membershipId, membershipType, ignoreCache);

    if (error.errorCode !== 1) {
      console.error("API Error", error.errorStatus);
      return;
    }

    const tempCards = clone(cards);
    tempCards[cardIndex].data = data;

    setCards(tempCards);
  };

  const deleteCard = async (membershipId: number) => {
    const card = cards.find(c => c.membershipId.toString() === membershipId.toString());
    if (!card) {
      return;
    }
    db.deletePlayerCache(card.membershipId);
    setCards(cards.filter(c => c.membershipId.toString() !== membershipId.toString()));
  };

  const setCardCharacterId = async (membershipId: number, characterId: number) => {
    const cardIndex = cards.findIndex(c => c.membershipId.toString() === membershipId.toString());
    await db.AppPlayersSelectedCharacter.put(cards[cardIndex].membershipId, characterId);
    const tempCards = clone(cards);
    tempCards[cardIndex].characterId = characterId;
    setCards(tempCards);
  };

  return (
    <CharacterContext.Provider
      value={{
        cards,
        addCard,
        replaceCards,
        findCard,
        loadCardData,
        deleteCard,
        setCardCharacterId,
      }}>
      {children}
    </CharacterContext.Provider>
  );
}
