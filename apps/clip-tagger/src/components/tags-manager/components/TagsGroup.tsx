import { useEffect, useRef, useState } from "react";
import { useAppContext } from "../../../context/AppContext";
import { TagGroup } from "../../../types/tags";
import { useTags } from "../../../context/TagsContext";
import { Box, Typography } from "@mui/material";
import { Tag } from "./Tag";
import { useKeybind } from "../../../context/KeyBindContext";

export const TagsGroup = ({ tagsGroup, groupName, key }: { tagsGroup: TagGroup, groupName: string, key: number }) => {
  const { AppRoot } = useAppContext();
  const { selectedTagGroup, setSelectedTagGroup } = useTags();
  const { blockGroupLevelListeners, setBlockGroupLevelListeners, iterableTagListModifier } = useKeybind();

  const handleKeyBindPress = useRef((event: KeyboardEvent) => {
    if (event.key === tagsGroup.keybindGroup && !blockGroupLevelListeners && !iterableTagListModifier) {
      setSelectedTagGroup(tagsGroup.id);
      setBlockGroupLevelListeners(true)
      return
    }
  })

  const addKeyBindGroupListener = () => {
    if (!AppRoot || !AppRoot.current) return;
    AppRoot.current.addEventListener("keydown", handleKeyBindPress.current);
  };

  const removeKeyBindGroupListener = () => {
    if (!AppRoot || !AppRoot.current) return;
    AppRoot.current.removeEventListener("keydown", handleKeyBindPress.current);
  };

  useEffect(() => {
    addKeyBindGroupListener();
    // return removeKeyBindGroupListener;
  }, []);

  useEffect(() => {
    if(blockGroupLevelListeners || iterableTagListModifier){
      removeKeyBindGroupListener()
    }else{
      addKeyBindGroupListener()
    }
  }, [blockGroupLevelListeners, iterableTagListModifier]);

  return (
    <>
      {selectedTagGroup === null && (
        <Box
          key={key}
          sx={{
            display: "flex",
            flexDirection: 'column',
            backgroundColor: "hsla(210, 20%, 40%, 0.5)",
            borderRadius: "2rem",
            flexGrow: "1",
            placeItems: "center",
            cursor: "pointer",
          }}
        >
          <Typography
            textAlign={"center"}
            sx={{ fontSize: "1rem", padding:'0 0 auto 0' }}
          >
            {groupName}
          </Typography>
          <Typography
            textAlign={"center"}
            sx={{ fontSize: "4rem", fontWeight: '900', padding: 'auto 0' }}
          >
            {tagsGroup.keybindGroup.toUpperCase()}
          </Typography>
        </Box>
      )}
      {selectedTagGroup === tagsGroup.id &&
        tagsGroup.tags.map((tag, index) => (
          <Box
            key={index}
            sx={{
              backgroundColor: "black",
              width: "12rem",
              height: "6rem",
              borderRadius: '2rem',
              placeItems: 'center'
            }}
          >
            <Tag tagObject={tag}/>
          </Box>
        ))}
    </>
  );
};
