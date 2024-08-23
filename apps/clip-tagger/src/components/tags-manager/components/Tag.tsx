import { Box, Typography } from "@mui/material";
import { TagObject, TagReference } from "../../../types/tags";
import { useEffect, useRef } from "react";
import { useAppContext } from "../../../context/AppContext";
import { useTags } from "../../../context/TagsContext";
import { useKeybind } from "../../../context/KeyBindContext";
import { useClipViewer } from "../../../context/ClipViewerContext";
import { ApiClient } from "../../../api/ApiClient";

export const Tag = ({ tagObject }: { tagObject: TagObject }) => {
  const { AppRoot } = useAppContext();
  const { setSelectedTagGroup, setTagReferenceMaster } = useTags();
  const { blockGroupLevelListeners, setBlockGroupLevelListeners } =
    useKeybind();
  const { videoPlayer, targetClip } = useClipViewer();

  const handleKeyBindPress = useRef((event: KeyboardEvent) => {
    if (event.key === tagObject.keybind && blockGroupLevelListeners) {
      const apiClient = new ApiClient();
      const tagReferenceToAdd: TagReference = {
        [tagObject.id]: [videoPlayer.current?.currentTime],
      };
      apiClient.updateFileProperties(
        targetClip,
        tagReferenceToAdd,
        tagObject.unique
      ).then((updatedTagReference) => {
        setTagReferenceMaster(updatedTagReference);
      })
      setBlockGroupLevelListeners(false);
    }
  });

  const addKeyBindListener = () => {
    if (!AppRoot || !AppRoot.current) return;
    AppRoot.current.addEventListener("keydown", handleKeyBindPress.current);
  };

  const removeKeyBindListener = () => {
    if (!AppRoot || !AppRoot.current) return;
    AppRoot.current.removeEventListener("keydown", handleKeyBindPress.current);
  };

  useEffect(() => {
    addKeyBindListener();
  }, []);

  useEffect(() => {
    if (blockGroupLevelListeners === false) {
      removeKeyBindListener();
      setSelectedTagGroup(null);
    } else {
      addKeyBindListener();
    }
  }, [blockGroupLevelListeners]);

  return (
    <Box>
      <Typography sx={{ fontSize: "2rem", fontWeight: "900" }}>
        {tagObject.keybind.toUpperCase()}
      </Typography>
      <Typography sx={{ fontSize: "1rem" }}>
        {tagObject.displayName ? tagObject.displayName : tagObject.tag}
      </Typography>
    </Box>
  );
};
