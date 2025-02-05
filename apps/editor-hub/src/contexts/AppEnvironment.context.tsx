import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { AppEnvironmentClient } from "../business-logic/AppEnvironment";
import { AppEnvironment } from "../types/app";

interface AppEnvironmentContextProps {
  appEnvironment: AppEnvironment
  setNewAppEnvironment: (newAppEnvironment: AppEnvironment) => void
}

const AppEnvironmentContext = createContext<AppEnvironmentContextProps | undefined>(
  undefined
);

export const useAppEnvironment = () => {
  const context = useContext(AppEnvironmentContext);
  if (!context) {
    throw new Error(
      "useAppEnvironment must be used within a AppEnvironmentProvider"
    );
  }
  return context;
};

export const AppEnvironmentProvider = ({ children }: { children: ReactNode }) => {
  const [ appEnvironment, setAppEnvironment] = useState<AppEnvironment>(null)

  const setNewAppEnvironment = (newAppEnvironment: AppEnvironment) => {
    if(appEnvironment === null) return;
    const appEnvironmentClient = new AppEnvironmentClient()
    appEnvironmentClient.setAppEnvironment(newAppEnvironment)
  }

  useEffect(() => {
    if (appEnvironment != null) return;

    const appEnvironmentClient = new AppEnvironmentClient()

    setAppEnvironment(appEnvironmentClient.appEnvironment);
  }, [])

  return (
    <AppEnvironmentContext.Provider
      value={{
        appEnvironment,
        setNewAppEnvironment
      }}
    >
      {children}
    </AppEnvironmentContext.Provider>
  );
};