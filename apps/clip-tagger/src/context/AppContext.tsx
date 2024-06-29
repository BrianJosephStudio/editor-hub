import React, { createContext, useRef, useContext, ReactNode, RefObject } from 'react';

interface AppContextType {
  AppRoot: RefObject<HTMLDivElement> | null;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const AppRoot = useRef<HTMLDivElement>(null);

  return (
    <AppContext.Provider value={{ AppRoot }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export default AppContext;
