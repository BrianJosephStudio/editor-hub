import { createContext, useContext, useState, ReactNode, useRef } from "react";
import {
  LabeledTagReference,
  TagGroup,
  TagObject,
  TagReference,
  TimeCode,
} from "../types/tags.d";
import { ApiClient } from "../api/ApiClient";
import { useClipViewer } from "./ClipViewerContext";
import Cookies from "js-cookie";
import { useFolderNavigation } from "./FolderNavigationContext";

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
  setTagReferenceLabeled: React.Dispatch<
    React.SetStateAction<LabeledTagReference>
  >;
  tagDisplayList: React.RefObject<HTMLDivElement>;
  tagOffset: number;
  setTagOffset: React.Dispatch<React.SetStateAction<number>>;
  addTags: (
    tagObjects: TagObject[],
    currentTime: number,
    exclusiveTagIds?: string[]
  ) => void;
  removeTag: (tagObject: TagObject, instanceId?: string) => void;
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
  const { targetClip } = useClipViewer();
  const [genericTags, setGenericTags] = useState<TagGroup[]>([]);
  const [agentTags, setAgentTags] = useState<TagGroup[]>([]);
  const [mapTags, setMapTags] = useState<TagGroup[]>([]);
  const [selectedTagGroup, setSelectedTagGroup] = useState<string | null>(null);
  const [tagReferenceMaster, setTagReferenceMaster] = useState<TagReference>(
    {}
  );
  const [tagReferenceLabeled, setTagReferenceLabeled] =
    useState<LabeledTagReference>({});
  const [tagOffset, setTagOffset] = useState<number>(() => {
    const defaultValue = 500
    const tagOffsetCookie = Cookies.get("tagOffset")
    if (!tagOffsetCookie) return defaultValue
    const tagOffsetNumber = parseInt(tagOffsetCookie)
    if (!isNaN(tagOffsetNumber)) {
      return tagOffsetNumber
    }
    return defaultValue
  });
  const tagDisplayList = useRef<HTMLDivElement>(null);

  const addTags = (
    tagObjects: TagObject[],
    currentTime: number,
    exclusiveTagIds?: string[]
  ) => {
    const apiClient = new ApiClient();
    setTagReferenceMaster((currentTagReference) => {
      let newTagReference: TagReference = { ...currentTagReference };

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
          const newEntry = [...newTagReference[tagObject.id]];
          newEntry.push(currentTime);
          newTagReference[tagObject.id] = newEntry;
        } else {
          newTagReference = {
            ...newTagReference,
            [tagObject.id]: tagObject.timeless ? [] : [currentTime],
          };
        }
      });

      apiClient
        .updateFileProperties(targetClip, newTagReference)
        .then(async (updateSuccessful) => {
          if (!updateSuccessful) {
            // let revertedTagReference = await apiClient.getMetadata(targetClip)
            // setTagReferenceMaster(revertedTagReference)
          }
        });
      return newTagReference;
    });
  };

  const removeTag = (tagObject: TagObject, instanceId?: string) => {
    let tagEntry = tagReferenceLabeled[tagObject.id];
    if (!tagEntry) return;
    if (instanceId) {
      tagEntry = tagEntry.filter(
        (timeEntry) => timeEntry.instanceId !== instanceId
      );
    }
    const newTagEntry: TimeCode[] = tagEntry.map(
      (timeEntry) => timeEntry.time
    );

    setTagReferenceMaster((currentTagReference) => {
      const updatedTagReference = {
        ...currentTagReference
      };

      if (newTagEntry.length < 1) {
        delete updatedTagReference[tagObject.id]
      } else {
        updatedTagReference[tagObject.id] = newTagEntry
      }

      const apiClient = new ApiClient();
      apiClient.updateFileProperties(targetClip, updatedTagReference);
      return updatedTagReference;
    });
  };

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
        addTags,
        removeTag,
      }}
    >
      {children}
    </TagsContext.Provider>
  );
};
