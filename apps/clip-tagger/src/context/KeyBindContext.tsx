import { createContext, useContext, useState, ReactNode } from "react";
import { IterableTagListId } from "../types/tags";

interface KeybindContextProps {
  blockGroupLevelListeners: boolean;
  setBlockGroupLevelListeners: React.Dispatch<React.SetStateAction<boolean>>;
  targetIterableTagList: IterableTagListId;
  setTargetIterableTagList: React.Dispatch<React.SetStateAction<IterableTagListId>>;
  iterableTagListModifier: boolean;
  setIterableTagListModifier: React.Dispatch<React.SetStateAction<boolean>>;
}

const KeybindContext = createContext<KeybindContextProps | undefined>(
  undefined
);

export const useKeybind = (): KeybindContextProps => {
  const context = useContext(KeybindContext);
  if (!context) {
    throw new Error("useKeybind must be used within a KeybindProvider");
  }
  return context;
};

export const KeybindProvider = ({ children }: { children: ReactNode }) => {
  const [blockGroupLevelListeners, setBlockGroupLevelListeners] =
    useState<boolean>(false);
  const [targetIterableTagList, setTargetIterableTagList] =
    useState<IterableTagListId>('agent');
  const [iterableTagListModifier, setIterableTagListModifier] =
    useState<boolean>(false);

  return (
    <KeybindContext.Provider
      value={{
        blockGroupLevelListeners,
        setBlockGroupLevelListeners,
        targetIterableTagList,
        setTargetIterableTagList,
        iterableTagListModifier,
        setIterableTagListModifier,
      }}
    >
      {children}
    </KeybindContext.Provider>
  );
};
