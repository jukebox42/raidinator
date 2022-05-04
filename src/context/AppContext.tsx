import { useState, createContext, useEffect } from "react";
import { v4 as uuid } from "uuid";

import db from "store/db";

// Components
import { Toast, SeverityType } from "components/generics";

// Interfaces
import { PlayerData, AppSettings } from "utils/interfaces";

interface AppContextProviderProps {
  children?: JSX.Element;
}

interface Card {
  membershipId: number;
  player: PlayerData;
}

type AppContextType = {
  loadAppSettings: () => Promise<void>;
  appSettings: AppSettings;
  setAppSettings: (newAppSettings: AppSettings) => void;
  cards: Card[],
  addCard: (membershipId: number, player: PlayerData) => void;
  deleteCard: (membershipId: number) => Promise<void>;
  replaceCards: (newCards: Card[]) => void;
  lastRefresh: number;
  refresh: () => void;
  addToast: (message: string, severity?: SeverityType) => void;
}

const defaultAppSettings: AppSettings = {
  championMods: true,
  ammoMods: true,
  lightMods: true,
  wellMods: true,
  raidMods: true,
  specialMods: true,
}

export const AppContext = createContext<AppContextType>({
  loadAppSettings: () => Promise.resolve(),
  appSettings: defaultAppSettings,
  setAppSettings: () => {},

  cards: [],
  addCard: () => {},
  deleteCard: () => Promise.resolve(),
  replaceCards: () => {},

  lastRefresh: 0,
  refresh: () => {},
  addToast: () => {},
});

const AppContextProvider = ({ children }: AppContextProviderProps) => {
  const [appSettings, _setAppSettings] = useState<AppSettings>(defaultAppSettings);
  const [cards, setCards] = useState<Card[]>([]);
  const [lastRefresh, setLastRefresh] = useState(0);
  const [toasts, setToasts] = useState<any[]>([]);

  const loadAppSettings = async () => {
    const dbSettings = await db.AppSettings.get(1);
    if (dbSettings) {
      _setAppSettings(dbSettings);
    } else {
      db.AppSettings.put(appSettings, 1);
    }
  };

  const setAppSettings = async (newAppSettings: AppSettings) => {
    _setAppSettings({ ...newAppSettings });
    db.AppSettings.put(newAppSettings, 1);
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
        toast: <Toast key={key} id={key} message={message} severity={severity} onClose={_removeToast} />
      }
    ]);
  }

  /**
   * Internal function to allow the toast to be removed by it's onClose.
   */
  const _removeToast = (key: string) => {
    const tempToasts = toasts.filter(t => t.key !== key);

    setToasts([...tempToasts]);
  }

  return (
    <AppContext.Provider
      value={{
        loadAppSettings,
        appSettings,
        setAppSettings,
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
