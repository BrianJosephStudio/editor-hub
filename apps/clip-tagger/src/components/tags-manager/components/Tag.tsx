import { Box, Typography } from "@mui/material";
import { TagObject } from "../../../types/tags";
import { useEffect, useRef } from "react";
import { useAppContext } from "../../../context/AppContext";
import { useTags } from "../../../context/TagsContext";
import { useKeybind } from "../../../context/KeyBindContext";
import { useClipViewer } from "../../../context/ClipViewerContext";

export const Tag = ({
  tagObject,
  exclusiveTagIds,
}: {
  tagObject: TagObject;
  exclusiveTagIds: string[] | undefined;
}) => {
  const { AppRoot } = useAppContext();
  const { setSelectedTagGroup, tagOffset, addTags } = useTags();
  const { blockGroupLevelListeners, setBlockGroupLevelListeners } =
    useKeybind();
  const { videoPlayer, setPauseOnInput } = useClipViewer();

  const handleKeyBindPress = useRef((event: KeyboardEvent) => {
    if (!videoPlayer.current) return;
    
    if (event.key === tagObject.keybind && blockGroupLevelListeners) {
      const currentTime =
        Math.max(videoPlayer.current.currentTime - 0.2 - tagOffset / 1000, 0);
      console.log("adding tag");
      addTags([tagObject], currentTime, exclusiveTagIds);

      setBlockGroupLevelListeners(false);
      setPauseOnInput((currentValue) => {
        if (!videoPlayer.current) return currentValue;
        if (currentValue === true) {
          videoPlayer.current.play();
        }
        return currentValue;
      });
    }
  });

  const addKeyBindListener = () => {
    if (!AppRoot || !AppRoot.current) return;
    // console.log("adding", tagObject.displayName);
    AppRoot.current.addEventListener("keydown", handleKeyBindPress.current);
  };

  const removeKeyBindListener = () => {
    if (!AppRoot || !AppRoot.current) return;
    // console.log("removing", tagObject.displayName);
    AppRoot.current.removeEventListener("keydown", handleKeyBindPress.current);
  };

  // useEffect(() => {
  //   addKeyBindListener();
  //   return removeKeyBindListener;
  // }, []);

  useEffect(() => {
    if (blockGroupLevelListeners === false) {
      removeKeyBindListener();
      setSelectedTagGroup(null);
    } else {
      removeKeyBindListener();
      addKeyBindListener();
    }
  }, [blockGroupLevelListeners]);

  return (
    <Box>
      <Typography sx={{ fontSize: "1.6rem", fontWeight: "900" }}>
        {tagObject.keybind.toUpperCase()}
      </Typography>
      <Typography sx={{ fontSize: "1rem" }}>
        {tagObject.displayName ? tagObject.displayName : tagObject.tag}
      </Typography>
    </Box>
  );
};
