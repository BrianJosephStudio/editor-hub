import { createContext, useContext, useState, ReactNode } from "react";
import { TagObject, TagGroup } from "../types/tags.d";

interface TagsContextProps {
  genericTags: TagGroup[];
  setGenericTags: React.Dispatch<React.SetStateAction<TagGroup[]>>;
  mapTags: TagGroup[];
  setMapTags: React.Dispatch<React.SetStateAction<TagGroup[]>>;
  agentTags: TagGroup[];
  setAgentTags: React.Dispatch<React.SetStateAction<TagGroup[]>>;
  selectedTagGroup: string | null;
  setSelectedTagGroup: React.Dispatch<React.SetStateAction<string | null>>;
}

const TagsContext = createContext<TagsContextProps | undefined>(undefined);

export const useTags = (): TagsContextProps => {
  const context = useContext(TagsContext);
  if (!context) {
    throw new Error("useTags must be used within a TagsProvider");
  }
  return context;
};

export const TagsProvider = ({ children }: { children: ReactNode }) => {
  const [genericTags, setGenericTags] = useState<TagGroup[]>([]);
  const [agentTags, setAgentTags] = useState<TagGroup[]>([]);
  const [mapTags, setMapTags] = useState<TagGroup[]>([]);
  const [selectedTagGroup, setSelectedTagGroup] = useState<string | null>(null);

  return (
    <TagsContext.Provider
      value={{
        genericTags,
        setGenericTags,
        agentTags,
        setAgentTags,
        mapTags,
        setMapTags,
        selectedTagGroup,
        setSelectedTagGroup,
      }}
    >
      {children}
    </TagsContext.Provider>
  );
};
