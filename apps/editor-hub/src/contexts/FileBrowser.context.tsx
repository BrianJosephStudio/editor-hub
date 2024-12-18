import { createContext, useContext, useState, ReactNode } from "react";

interface FileBrowserContextProps {
  tabIndex: number;
  setTabIndex: React.Dispatch<React.SetStateAction<number>>
}

const FileBrowserContext = createContext<FileBrowserContextProps | undefined>(
  undefined
);

export const useFileBrowser = () => {
  const context = useContext(FileBrowserContext);
  if (!context) {
    throw new Error(
      "useFileBrowser must be used within a FileBrowserProvider"
    );
  }
  return context;
};

export const FileBrowserProvider = ({ children }: { children: ReactNode }) => {
  const [tabIndex, setTabIndex] = useState<number>(0)

  return (
    <FileBrowserContext.Provider
      value={{
        tabIndex,
        setTabIndex,
      }}
    >
      {children}
    </FileBrowserContext.Provider>
  );
};