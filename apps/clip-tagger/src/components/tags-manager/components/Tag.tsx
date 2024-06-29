import { Box, Typography } from "@mui/material";
import { TagObject } from "../../../types/tags";
import { useEffect, useRef } from "react";
import { useAppContext } from "../../../context/AppContext";
import { useTags } from "../../../context/TagsContext";
import { useKeybind } from "../../../context/KeyBindContext";

export const Tag = ({ tagObject }: { tagObject: TagObject }) => {
  const { AppRoot } = useAppContext();
  const {
    selectedTagGroup,
    setSelectedTagGroup,
  } = useTags();
  const { blockGroupLevelListeners, setBlockGroupLevelListeners } = useKeybind();

  const handleKeyBindPress = useRef((event: KeyboardEvent) => {
    if (event.key === tagObject.keybind && blockGroupLevelListeners) {
      //TODO: add tag
      return;
    }
    console.log("about to");
    setBlockGroupLevelListeners(false);
  });

  const addKeyBindListener = () => {
    if (!AppRoot || !AppRoot.current) return;
    AppRoot.current.addEventListener("keydown", handleKeyBindPress.current);
  };

  const removeKeyBindListener = () => {
    if (!AppRoot || !AppRoot.current) return;
    console.log("removing tag listener");
    AppRoot.current.removeEventListener("keydown", handleKeyBindPress.current);
  };

  useEffect(() => {
    addKeyBindListener();
    // return removeKeyBindGroupListener;
  }, []);

  useEffect(() => {
    console.log("aqui en tag", blockGroupLevelListeners);
    if (blockGroupLevelListeners === false) {
      removeKeyBindListener();
      setSelectedTagGroup(null);
    } else {
      addKeyBindListener();
    }
  }, [blockGroupLevelListeners]);
  return (
    <Box>
      <Typography sx={{fontSize: '2rem', fontWeight: '900'}}>{tagObject.keybind.toUpperCase()}</Typography>
      <Typography sx={{fontSize: '1rem'}}>{tagObject.displayName ? tagObject.displayName : tagObject.tag}</Typography>
    </Box>
  );
};
