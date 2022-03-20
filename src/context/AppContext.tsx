import { now } from "lodash";
import { useState, createContext } from "react";

import db from "../store/db";

import { PlayerData } from "../utils/interfaces";

interface AppContextProviderProps {
  children?: JSX.Element;
}

interface Card {
  membershipId: number;
  player: PlayerData;
}

type AppContextType = {
  lastRefresh: number;
  refresh: () => void;
  cards: Card[],
  addCard: (membershipId: number, player: PlayerData) => void;
  deleteCard: (membershipId: number) => Promise<void>;
  replaceCards: (newCards: Card[]) => void;
}

export const AppContext = createContext<AppContextType>({
  lastRefresh: 0,
  refresh: () => {},
  cards: [],
  addCard: () => {},
  deleteCard: () => Promise.resolve(),
  replaceCards: () => {},
});

const AppContextProvider = ({ children }: AppContextProviderProps) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [lastRefresh, setLastRefresh] = useState(0);

  const refresh = async () => {
    setLastRefresh(new Date().getTime());
  }

  const addCard = async (membershipId: number, player: PlayerData) => {
    if (cards.length === 6 || cards.find(c => c.membershipId === membershipId)) {
      return;
    }
    setCards([...cards, { membershipId, player }]);
  };

  const deleteCard = async (membershipId: number) => {
    const card = cards.find(c => c.membershipId.toString() === membershipId.toString());
    if (!card) {
      return;
    }
    db.deletePlayerCache(card.membershipId);
    setCards(cards.filter(c => c.membershipId.toString() !== membershipId.toString()));
  };

  const replaceCards = async (newCards: Card[] ) => {
    if(newCards.length > 6) {
      return;
    }

    const tempCards = newCards.map(c => { return {membershipId: c.membershipId, player: c.player}});
    setCards([...tempCards]);
  }

  return (
    <AppContext.Provider
      value={{
        cards,
        addCard,
        replaceCards,
        deleteCard,
        lastRefresh,
        refresh,
      }}>
      {children}
    </AppContext.Provider>
  );
}

export default AppContextProvider;
