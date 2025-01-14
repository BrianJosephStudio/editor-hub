import { createContext, useContext, useState, ReactNode, useRef } from "react";
import apiClient from "../api/ApiClient";
import { useClipViewer } from "./ClipViewerContext";
import Cookies from "js-cookie";
import { ParsedFileName } from "../util/dropboxFileParsing";
import { v4 as uuid } from "uuid";
import { getTagObjectFromId, getTagObjectFromInstanceId, unlabelTagReference } from "../util/tagObjectHelpers";
import { AgentTags, GenericTags, LabeledTagReference, MapTags, TagGroup, TagObject, TimeEntry, UnlabeledTagReference } from "@editor-hub/tag-system";

interface TagsContextProps {
  genericTags: TagGroup[];
  setGenericTags: React.Dispatch<React.SetStateAction<TagGroup[]>>;
  mapTags: TagGroup[];
  setMapTags: React.Dispatch<React.SetStateAction<TagGroup[]>>;
  agentTags: TagGroup[];
  setAgentTags: React.Dispatch<React.SetStateAction<TagGroup[]>>;
  selectedTagGroup: string | null;
  setSelectedTagGroup: React.Dispatch<React.SetStateAction<string | null>>;
  unlabeledTagReference: UnlabeledTagReference;
  setUnlabeledTagReference: React.Dispatch<React.SetStateAction<UnlabeledTagReference>>;
  labeledTagReference: LabeledTagReference;
  setLabeledTagReference: React.Dispatch<
    React.SetStateAction<LabeledTagReference>
  >;
  tagDisplayList: React.RefObject<HTMLDivElement>;
  tagOffset: unknown;
  setTagOffset: React.Dispatch<React.SetStateAction<unknown>>;
  unDoTagHistory: string[];
  setUndoTagHistory: React.Dispatch<React.SetStateAction<string[]>>;
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
  const [labeledTagReference, setLabeledTagReference] = useState<LabeledTagReference>({});
  const [unlabeledTagReference, setUnlabeledTagReference] = useState<UnlabeledTagReference>({});
  const [unDoTagHistory, setUndoTagHistory] = useState<string[]>([])

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
    const streamerClipTag = GenericTags.clipType.tags.find(tagObject => tagObject.id === "c003")

    if (!currentMap || !currentAgent || !streamerClipTag)
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
      streamerClipTag
    ], 0, exclusiveTagIds)
  }

  const addTags = (
    tagObjects: TagObject[],
    currentTime: number,
    exclusiveTagIds?: string[]
  ) => {
    setLabeledTagReference((currentLabeledTagReference) => {
      let newTagReference: LabeledTagReference = { ...currentLabeledTagReference };

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

        const newInstanceId = uuid()
        if (!tagObject.unique && referenceExistsInMaster) {
          const newEntry = [...newTagReference[tagObject.id]];
          newEntry.push({
            time: currentTime,
            instanceId: newInstanceId
          });
          newTagReference[tagObject.id] = newEntry;
          setUndoTagHistory(currentHistory => ([
            ...currentHistory,
            newInstanceId
          ]))
        } else if (tagObject.timeless) {
          newTagReference = {
            ...newTagReference,
            [tagObject.id]: []
          };
          setUndoTagHistory(currentHistory => ([
            ...currentHistory,
            tagObject.id
          ]))
        } else {
          newTagReference = {
            ...newTagReference,
            [tagObject.id]: [
              {
                time: currentTime,
                instanceId: newInstanceId
              }
            ],
          };
          setUndoTagHistory(currentHistory => ([
            ...currentHistory,
            newInstanceId
          ]))
        }
      });

      const unlabeledTagReference = unlabelTagReference(newTagReference)

      apiClient
        .updateFileProperties(targetClip, unlabeledTagReference)
        .then(async (updateSuccessful) => {
          if (!updateSuccessful) {
          }
        });
      return newTagReference;
    });
  };

  const removeTag = (tagObject: TagObject, instanceId?: string) => {
    let tagEntry = labeledTagReference[tagObject.id];
    if (!tagEntry) return;
    if (instanceId) {
      tagEntry = tagEntry.filter(
        (timeEntry) => timeEntry.instanceId !== instanceId
      );
    }
    const newTagEntry: TimeEntry[] = tagEntry.map(
      (timeEntry) => ({
        time: timeEntry.time,
        instanceId: uuid()
      })
    );

    setLabeledTagReference((currentTagReference) => {
      const updatedTagReference = {
        ...currentTagReference
      };

      if (newTagEntry.length < 1) {
        delete updatedTagReference[tagObject.id]
      } else {
        updatedTagReference[tagObject.id] = newTagEntry
      }

      const unlabeledTagReference = unlabelTagReference(updatedTagReference)

      apiClient.updateFileProperties(targetClip, unlabeledTagReference);
      return updatedTagReference;
    });
  };

  const removeLastAddedTag = (): void => {
    let lastAddedId: string | undefined
    let lastAddedTagInstanceId: string | undefined

    setUndoTagHistory(currentHistory => {
      const newHistory = [...currentHistory]
      lastAddedId = newHistory.pop()
      return newHistory
    })

    if (!lastAddedId) return;

    //Checking to see if string is object id
    console.log(lastAddedId)
    const tagObjectFromId = getTagObjectFromId(lastAddedId)
    console.log(tagObjectFromId)
    if (tagObjectFromId) {
      return removeTag(tagObjectFromId)
    };
    //if no, by default it's got to be an instance id

    lastAddedTagInstanceId = lastAddedId;

    const tagObject = getTagObjectFromInstanceId(lastAddedTagInstanceId, { ...labeledTagReference })
    if (!tagObject) return

    removeTag(tagObject, lastAddedTagInstanceId)
  }


  const resetTags = async (path: string) => {
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
        unlabeledTagReference,
        setUnlabeledTagReference,
        labeledTagReference,
        setLabeledTagReference,
        tagDisplayList,
        tagOffset,
        setTagOffset,
        unDoTagHistory,
        setUndoTagHistory,
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
