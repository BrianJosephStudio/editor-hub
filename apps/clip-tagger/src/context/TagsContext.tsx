import { createContext, useContext, useState, ReactNode, useRef } from "react";
import { LabeledTagReference, TagGroup, TagReference } from "../types/tags.d";

interface TagsContextProps {
  genericTags: TagGroup[];
  setGenericTags: React.Dispatch<React.SetStateAction<TagGroup[]>>;
  mapTags: TagGroup[];
  setMapTags: React.Dispatch<React.SetStateAction<TagGroup[]>>;
  agentTags: TagGroup[];
  setAgentTags: React.Dispatch<React.SetStateAction<TagGroup[]>>;
  selectedTagGroup: string | null;
  setSelectedTagGroup: React.Dispatch<React.SetStateAction<string | null>>;
  tagReferenceMaster: TagReference;
  setTagReferenceMaster: React.Dispatch<React.SetStateAction<TagReference>>;
  tagReferenceLabeled: LabeledTagReference;
  setTagReferenceLabeled: React.Dispatch<React.SetStateAction<LabeledTagReference>>;
  tagDisplayList: React.RefObject<HTMLDivElement>
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
  const [tagReferenceMaster, setTagReferenceMaster] = useState<TagReference>({});
  const [tagReferenceLabeled, setTagReferenceLabeled] = useState<LabeledTagReference>({});
  const tagDisplayList = useRef<HTMLDivElement>(null);
  
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
        tagReferenceMaster,
        setTagReferenceMaster,
        tagReferenceLabeled,
        setTagReferenceLabeled,
        tagDisplayList
      }}
    >
      {children}
    </TagsContext.Provider>
  );
};
