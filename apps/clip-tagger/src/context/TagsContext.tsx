import { createContext, useContext, useState, ReactNode, useRef } from "react";
import { LabeledTagReference, TagGroup, TagObject, TagReference } from "../types/tags.d";
import { ApiClient } from "../api/ApiClient";
import { useClipViewer } from "./ClipViewerContext";

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
  tagOffset: number;
  setTagOffset: React.Dispatch<React.SetStateAction<number>>;
  addTags: (tagObjects: TagObject[], currentTime: number, exclusiveTagIds?: string[]) => void
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
  const { targetClip } = useClipViewer()
  const [genericTags, setGenericTags] = useState<TagGroup[]>([]);
  const [agentTags, setAgentTags] = useState<TagGroup[]>([]);
  const [mapTags, setMapTags] = useState<TagGroup[]>([]);
  const [selectedTagGroup, setSelectedTagGroup] = useState<string | null>(null);
  const [tagReferenceMaster, setTagReferenceMaster] = useState<TagReference>({});
  const [tagReferenceLabeled, setTagReferenceLabeled] = useState<LabeledTagReference>({});
  const [tagOffset, setTagOffset] = useState<number>(500);
  const tagDisplayList = useRef<HTMLDivElement>(null);

  const addTags = (tagObjects: TagObject[], currentTime: number, exclusiveTagIds?: string[]) => {
    const apiClient = new ApiClient
    console.log("addTags starts", tagReferenceMaster)
    setTagReferenceMaster((currentTagReference) => {
      let newTagReference: TagReference = {...currentTagReference}
      console.log("newTagReference", newTagReference)
      
      if (exclusiveTagIds) {
        exclusiveTagIds.forEach((tagId) => {
          if (!!newTagReference[tagId]) {
            delete newTagReference[tagId];
          }
        });
      }

      tagObjects.forEach((tagObject) => {
        const referenceExistsInMaster = Array.isArray(
          newTagReference[tagObject.id]
        );

        if (!tagObject.unique && referenceExistsInMaster) {
          console.log("currentTime", currentTime)
          const newEntry = [...newTagReference[tagObject.id]]
          console.log("newEntry", newEntry)
          newEntry.push(currentTime)
          console.log("newEntry.push", newEntry)
          newTagReference[tagObject.id] = newEntry
          console.log(newTagReference)
          console.log(newTagReference[tagObject.id])
        } else {
          newTagReference = {
            ...newTagReference,
            [tagObject.id]:  tagObject.timeless ? [] : [currentTime]
          };
        }

      })
      console.log('newTagReference', newTagReference)

      console.log("about to update")
      apiClient.updateFileProperties(
        targetClip,
        newTagReference
      ).then(async (updateSuccessful) => {
        if(!updateSuccessful){
          console.log("attempting to reverse")
          // let revertedTagReference = await apiClient.getMetadata(targetClip)
          // setTagReferenceMaster(revertedTagReference)
        }
      })
      console.log("returning", newTagReference)
      return newTagReference
    })
  }

  // const removeTag = () => {}
  
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
        tagDisplayList,
        tagOffset,
        setTagOffset,
        addTags
      }}
    >
      {children}
    </TagsContext.Provider>
  );
};
