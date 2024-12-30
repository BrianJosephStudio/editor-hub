import { createContext, useContext, useState, ReactNode, useRef } from "react";
import {
  LabeledTagReference,
  TagGroup,
  TagObject,
  TagReference,
  TimeCode,
  TimeEntry,
} from "../types/tags.d";
import { ApiClient } from "../api/ApiClient";
import { useClipViewer } from "./ClipViewerContext";
import Cookies from "js-cookie";
import { ParsedFileName } from "../util/dropboxFileParsing";
import { AgentTags, GenericTags, MapTags } from "../resources/TagSystem";

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
  tagOffset: unknown;
  setTagOffset: React.Dispatch<React.SetStateAction<unknown>>;
  setStarterTags: () => Promise<void>
  addTags: (
    tagObjects: TagObject[],
    currentTime: number,
    exclusiveTagIds?: string[]
  ) => void;
  removeTag: (tagObject: TagObject, instanceId?: string) => void;
  removeLastAddedTag: () => void
  resetTags: (path: string) => Promise<void>;
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
  const [genericTags, setGenericTags] = useState<TagGroup[]>(Object.values(GenericTags));
  const [agentTags, setAgentTags] = useState<TagGroup[]>([]);
  const [mapTags, setMapTags] = useState<TagGroup[]>([]);
  const [selectedTagGroup, setSelectedTagGroup] = useState<string | null>(null);
  const [tagReferenceMaster, setTagReferenceMaster] = useState<TagReference>({});
  const [tagReferenceLabeled, setTagReferenceLabeled] = useState<LabeledTagReference>({});

  const [tagOffset, setTagOffset] = useState<unknown>(() => {
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

  const setStarterTags = async () => {
    const currentFileParsed = new ParsedFileName(targetClip, 0);
    const currentMap = MapTags.find(
      (mapTag) => mapTag.tag === currentFileParsed.map.toLocaleLowerCase()
    );
    const currentAgent = AgentTags.find(
      (agentTag) =>
        agentTag.tag === currentFileParsed.agent.toLocaleLowerCase()
    );
    const inGameClipTag = GenericTags.clipType.tags.find(tagObject => tagObject.id === "c002")

    if (!currentMap || !currentAgent || !inGameClipTag)
      throw new Error("Map, Agent, or ClipType tags are wrong in resource path");

    const mapTagIds = MapTags.map((mapTag) => {
      return mapTag.id;
    });
    const agentTagIds = AgentTags.map((agentTag) => {
      return agentTag.id;
    });

    const clipTypeTagIds = GenericTags.clipType.tags.map((clipTypeTag) => {
      return clipTypeTag.id;
    });

    const exclusiveTagIds = [...mapTagIds, ...agentTagIds, ...clipTypeTagIds];
    addTags([
      currentAgent,
      currentMap,
      inGameClipTag
    ], 0, exclusiveTagIds)
  }

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

  const getLastAddedTag = (): [string, string] | undefined => {
    if (Object.keys(tagReferenceLabeled).length === 0) {
      return undefined;
    }

    let latestEntry: TimeEntry | null = null;
    let latestTagId: string | null = null;

    Object.entries(tagReferenceLabeled).forEach(([tagId, timeEntryArray]) => {
      timeEntryArray.forEach((timeEntry) => {
        if (latestEntry) console.log(timeEntry.created, 'is greater than', latestEntry.created, timeEntry.created > latestEntry.created);
        if (!latestEntry || timeEntry.created > latestEntry.created) {
          latestEntry = timeEntry;
          latestTagId = tagId;
        }
      });
    });

    return [latestTagId!, latestEntry!.instanceId];
  };

  const removeLastAddedTag = () => {
    const lastAddedTagData = getLastAddedTag()
    if (!lastAddedTagData) return;
    const [lastAddedTagId, lastAddedInstanceId] = lastAddedTagData
    let targetTagObject: TagObject | undefined = undefined
    genericTags.forEach(tagGroup => {
      tagGroup.tags.forEach(tag => {
        if (tag.id !== lastAddedTagId) return;
        targetTagObject = tag;
      })
    })
    if (!targetTagObject) return;
    removeTag(targetTagObject, lastAddedInstanceId)
  }


  const resetTags = async (path: string) => {
    const apiClient = new ApiClient()

    await apiClient.removeFilePropertyGroup(path)
  }

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
        setStarterTags,
        addTags,
        removeTag,
        removeLastAddedTag,
        resetTags
      }}
    >
      {children}
    </TagsContext.Provider>
  );
};
