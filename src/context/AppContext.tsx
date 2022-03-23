import { useState, createContext } from "react";
import { Toast, SeverityType } from "../components/generics";
import { v4 as uuid } from "uuid";

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
  cards: Card[],
  addCard: (membershipId: number, player: PlayerData) => void;
  deleteCard: (membershipId: number) => Promise<void>;
  replaceCards: (newCards: Card[]) => void;
  lastRefresh: number;
  refresh: () => void;
  addToast: (message: string, severity?: SeverityType) => void;
}

export const AppContext = createContext<AppContextType>({
  cards: [],
  addCard: () => {},
  deleteCard: () => Promise.resolve(),
  replaceCards: () => {},
  lastRefresh: 0,
  refresh: () => {},
  addToast: () => {},
});

const AppContextProvider = ({ children }: AppContextProviderProps) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [lastRefresh, setLastRefresh] = useState(0);
  const [toasts, setToasts] = useState<any[]>([]);

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

    const deletePromises = cards.map(c => db.deletePlayerCache(c.membershipId));
    await Promise.allSettled(deletePromises);

    const addCards = newCards.map(c => db.AppPlayers.put(c.player, c.player.membershipId));
    await Promise.allSettled(addCards);

    const tempCards = newCards.map(c => { return {membershipId: c.membershipId, player: c.player}});
    setCards([...tempCards]);
  }

  const refresh = async () => {
    setLastRefresh(new Date().getTime());
  }

  const addToast = (message: string, severity: SeverityType = "info") => {
    const key = uuid();
    setToasts([
      ...toasts,
      {
        key: key,
        toast: <Toast key={key} message={message} severity={severity} onClose={removeToast} />
      }
    ]);
  }

  /**
   * Internal function to allow the toast to be removed by it's onClose.
   */
  const removeToast = (key: string) => {
    const tempToasts = toasts.filter(t => t.key !== key);

    setToasts([...tempToasts]);
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
        addToast,
    }}>
      {children}
      {toasts.map(toast => toast.toast)}
    </AppContext.Provider>
  );
}

export default AppContextProvider;
