import { Box } from "@mui/material";
import { GenericTags } from "../../../../resources/TagSystem.ts";
import { useEffect } from "react";
import { TagsGroup } from "./components/TagsGroup";
import { useKeybind } from "../../../../context/KeyBindContext.tsx";
import { useClipViewer } from "../../../../context/ClipViewerContext.tsx";
import { ApiClient } from "../../../../api/ApiClient.ts";
import { useTags } from "../../../../context/TagsContext.tsx";

export const TagsManager = () => {
  const { targetClip } = useClipViewer();
  const {
    blockGroupLevelListeners,
  } = useKeybind();

  const { setStarterTags, setTagReferenceMaster } = useTags();

  useEffect(() => {
    setTagReferenceMaster({})
    const getMetadata = async () => {
      if(!targetClip) return
      const apiClient = new ApiClient();
      const currentTagReference = await apiClient.getMetadata(targetClip);
      console.log("target clip changed:", currentTagReference)
      if (Object.keys(currentTagReference).length === 0) {
        await setStarterTags()
      }else{
        setTagReferenceMaster(currentTagReference)
      }
    };
    getMetadata();
  }, [targetClip]);

  return (
    <>
      <Box
        sx={{
          display: blockGroupLevelListeners ? "flex" : "grid",
          gridGap: " 0.3rem",
          gridTemplateRows: "repeat(2, 1fr)",
          gridTemplateColumns: "repeat(6, 1fr)",
          padding: "0.6rem",
          placeContent: 'center',
          flexWrap: 'wrap',
          overflow: 'auto'
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
