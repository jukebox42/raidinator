import { createContext } from "react";

export interface IAppContext {
  id?: string,
  key: string,
}

export const AppContext = createContext<IAppContext[]>([]);