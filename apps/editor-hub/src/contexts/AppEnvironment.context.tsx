import { createContext, useContext, useState, ReactNode, useRef, useEffect } from "react";
import { AppEnvironmentClient } from "../business-logic/AppEnvironment";
import { AppEnvironment } from "../types/app";

type appVersion = 'Latest' | 'Beta' | 'Dev' | 'Localhost' | 'Staging' | null

interface AppEnvironmentContextProps {
  appEnvironment: AppEnvironment
  appVersion: appVersion
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
  const [appVersion, setAppVersion] = useState<appVersion>(null)

  const setNewAppEnvironment = (newAppEnvironment: AppEnvironment) => {
    if (appVersion === null) return;
    const appEnvironmentClient = new AppEnvironmentClient()
    appEnvironmentClient.setAppEnvironment(newAppEnvironment)
  }

  useEffect(() => {
    if (appEnvironment != null) return;

    const appEnvironmentClient = new AppEnvironmentClient()

    setAppEnvironment(appEnvironmentClient.appEnvironment);
    if (appEnvironmentClient.appEnvironment === 'production') setAppVersion('Latest');
    if (appEnvironmentClient.appEnvironment === 'qa') setAppVersion('Beta');
    if (appEnvironmentClient.appEnvironment === 'dev') setAppVersion('Dev');
    if (appEnvironmentClient.appEnvironment === 'localhost') setAppVersion('Localhost');
    if (appEnvironmentClient.appEnvironment === 'staging') setAppVersion('Staging');
  }, [])

  return (
    <AppEnvironmentContext.Provider
      value={{
        appEnvironment,
        appVersion,
        setNewAppEnvironment
      }}
    >
      {children}
    </AppEnvironmentContext.Provider>
  );
};