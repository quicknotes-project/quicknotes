import { createContext, useContext, useState } from "react";
import { Nestable } from "../types";

export type AppState = "" | "loading..." | "saving..." | "done!" | "error";

interface AppStateInterface {
  appState: AppState;
  setAppState: React.Dispatch<React.SetStateAction<AppState>>;
}

const AppContext = createContext<AppStateInterface | null>(null);

export function AppStateProvider({ children }: Nestable) {
  const [appState, setAppState] = useState<AppState>("");

  const values = {
    appState,
    setAppState,
  };

  return <AppContext.Provider value={values}>{children}</AppContext.Provider>;
}

export function useAppState() {
  return useContext(AppContext)!;
}
