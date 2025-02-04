import { createContext, useContext, useState, ReactNode, useRef, useEffect } from "react";
import { AppEnvironmentClient } from "../business-logic/AppEnvironment";

type appVersion = 'Latest' | 'Beta' | 'Dev' | 'Localhost' | null

interface AppEnvironmentContextProps {
  appVersion: appVersion
  switchAppEnvironment: () => void
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
  const [appVersion, setAppEnvironment] = useState<appVersion>(null)

  const switchAppEnvironment = () => {
    if (appVersion == null) return;
    const appEnvironmentClient = new AppEnvironmentClient()

    const { appEnvironment, setAppEnvironment } = appEnvironmentClient

    if (appEnvironment === 'production') setAppEnvironment('qa')
    if (appEnvironment === 'qa') setAppEnvironment('production')
    if (appEnvironment === 'localhost') setAppEnvironment('production')
  }

  useEffect(() => {
    if (appVersion != null) return;

    const appEnvironmentClient = new AppEnvironmentClient()

    if (appEnvironmentClient.appEnvironment === 'production') setAppEnvironment('Latest');
    if (appEnvironmentClient.appEnvironment === 'qa') setAppEnvironment('Beta');
    if (appEnvironmentClient.appEnvironment === 'dev') setAppEnvironment('Dev');
    if (appEnvironmentClient.appEnvironment === 'localhost') setAppEnvironment('Localhost');
  }, [])

  return (
    <AppEnvironmentContext.Provider
      value={{
        appVersion,
        switchAppEnvironment
      }}
    >
      {children}
    </AppEnvironmentContext.Provider>
  );
};