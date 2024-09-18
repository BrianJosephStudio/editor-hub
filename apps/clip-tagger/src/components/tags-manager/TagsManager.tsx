import { Box } from "@mui/material";
import { GenericTags } from "../../resources/TagSystem.ts";
import { useEffect } from "react";
import { TagsGroup } from "./components/TagsGroup";
import { useKeybind } from "../../context/KeyBindContext.tsx";
import { useClipViewer } from "../../context/ClipViewerContext.tsx";
import { ApiClient } from "../../api/ApiClient.ts";
import { useTags } from "../../context/TagsContext.tsx";
import { TagReference } from "../../types/tags";
import { ParsedFileName } from "../../util/dropboxFileParsing";
import { MapTags } from "../../resources/TagSystem.ts";
import { AgentTags } from "../../resources/TagSystem.ts";

export const TagsManager = () => {
  const { targetClip } = useClipViewer();
  const {
    blockGroupLevelListeners,
  } = useKeybind();

  const { setTagReferenceMaster } = useTags();

  useEffect(() => {
    const getMetadata = async () => {
      const apiClient = new ApiClient();
      const currentTagReference = await apiClient.getMetadata(targetClip);
      let newTagReference = currentTagReference;
      if (Object.keys(currentTagReference).length === 0) {
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

        const tagReferenceToAdd: TagReference = {
          [currentAgent.id]: [],
          [currentMap.id]: [],
          [inGameClipTag.id]: [],
        };

        const mapTagIds = MapTags.map((mapTag) => {
          return mapTag.id;
        });
        const agentTagIds = AgentTags.map((agentTag) => {
          return agentTag.id;
        });
        const exclusiveTagIds = [...mapTagIds, ...agentTagIds];
        newTagReference = await apiClient.updateFileProperties(
          targetClip,
          tagReferenceToAdd,
          exclusiveTagIds,
          true
        );
        console.log(newTagReference)
      }
      setTagReferenceMaster(newTagReference);
    };
    getMetadata();
  }, [targetClip]);

  return (
    <>
      <Box
        sx={{
          display: blockGroupLevelListeners ? "flex" : "grid",
          gridGap: " 0.6rem",
          gridTemplateRows: "repeat(2, 1fr)",
          gridTemplateColumns: "repeat(6, 1fr)",
          padding: "0.6rem",
        }}
      >
        {Object.keys(GenericTags).map((groupName, index) => (
          <TagsGroup
            tagsGroup={GenericTags[groupName]}
            groupName={groupName}
            key={index}
          ></TagsGroup>
        ))}
      </Box>
    </>
  );
};
