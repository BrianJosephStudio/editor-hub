import { createContext, useContext, useState, ReactNode } from "react";

interface TagsContextProps {
  filterByTags: boolean;
  setFilterByTags: React.Dispatch<React.SetStateAction<boolean>>
  activeTags: string[];
  setActiveTags: React.Dispatch<React.SetStateAction<string[]>>
}

const TagsContext = createContext<TagsContextProps | undefined>(
  undefined
);

export const useTags = () => {
  const context = useContext(TagsContext);
  if (!context) {
    throw new Error("useTags must be used within a TagsProvider");
  }
  return context;
};

export const TagsProvider = ({ children }: { children: ReactNode }) => {
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [filterByTags, setFilterByTags] = useState<boolean>(false);

  return (
    <TagsContext.Provider
      value={{
        activeTags,
        setActiveTags,
        filterByTags,
        setFilterByTags,
      }}
    >
      {children}
    </TagsContext.Provider>
  );
};
