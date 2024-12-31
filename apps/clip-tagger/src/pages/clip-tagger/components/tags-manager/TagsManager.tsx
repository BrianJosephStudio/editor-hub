import { Box } from "@mui/material";
import { GenericTags } from "../../../../resources/TagSystem.ts";
import { useEffect } from "react";
import { TagsGroup } from "./components/TagsGroup";
import { useKeybind } from "../../../../context/KeyBindContext.tsx";
import { useClipViewer } from "../../../../context/ClipViewerContext.tsx";
import { ApiClient } from "../../../../api/ApiClient.ts";
import { useTags } from "../../../../context/TagsContext.tsx";
import { labelTagReference } from "../../../../util/tagObjectHelpers.ts";

export const TagsManager = () => {
  const { targetClip } = useClipViewer();
  const {
    blockGroupLevelListeners,
  } = useKeybind();

  const { setStarterTags, setLabeledTagReference, setUndoTagHistory } = useTags();

  useEffect(() => {
    if(!targetClip) return
    setLabeledTagReference({})
    setUndoTagHistory([])
    const getMetadata = async () => {
      const apiClient = new ApiClient();
      const unlabeledTagReference = await apiClient.getMetadata(targetClip);
      const labeledTagReference = labelTagReference(unlabeledTagReference)
      if (Object.keys(labeledTagReference).length === 0) {
        await setStarterTags()
      }else{
        setLabeledTagReference(labeledTagReference)
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
