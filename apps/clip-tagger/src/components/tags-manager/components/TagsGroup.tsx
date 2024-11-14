import { useEffect, useRef } from "react";
import { useAppContext } from "../../../context/AppContext";
import { TagGroup } from "../../../types/tags";
import { useTags } from "../../../context/TagsContext";
import { Box, Typography } from "@mui/material";
import { Tag } from "./Tag";
import { useKeybind } from "../../../context/KeyBindContext";
import { useClipViewer } from "../../../context/ClipViewerContext";

export const TagsGroup = ({ tagsGroup, groupName, key }: { tagsGroup: TagGroup, groupName: string, key: number }) => {
  const { AppRoot } = useAppContext();
  const { selectedTagGroup, setSelectedTagGroup } = useTags();
  const { blockGroupLevelListeners, setBlockGroupLevelListeners, iterableTagListModifier, clipBrowserModifier } = useKeybind();
  const {currentVideoSource, targetClip, setPauseOnInput, videoPlayer} = useClipViewer()

  const exclusiveTagIds = useRef<string[] | undefined>(undefined)

  if(tagsGroup.exclusive){
    exclusiveTagIds.current = tagsGroup.tags.map((tagObject) => tagObject.id)
  }

  const handleKeyBindPress = useRef((event: KeyboardEvent) => {
    if (event.key === tagsGroup.keybindGroup && !blockGroupLevelListeners && !iterableTagListModifier) {
      setPauseOnInput((currentValue) => {
        if(!videoPlayer.current) return currentValue
        if(currentValue){
          videoPlayer.current.pause()
        }
        return currentValue
      })
      setSelectedTagGroup(tagsGroup.id)
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
    if(blockGroupLevelListeners || iterableTagListModifier || clipBrowserModifier){
      removeKeyBindGroupListener()
    }else{
      if(!currentVideoSource || !targetClip) return
      addKeyBindGroupListener()
    }
  }, [blockGroupLevelListeners, iterableTagListModifier, clipBrowserModifier, currentVideoSource]);

  return (
    <>
      {selectedTagGroup === null && (
        <Box
          key={key}
          sx={{
            display: "flex",
            flexDirection: 'column',
            borderRadius: "2rem",
            flexGrow: "1",
            placeItems: "center",
            cursor: "pointer",
            height: '100%',
            backgroundColor: 'black'
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
              placeItems: 'center',
            }}
          >
            <Tag tagObject={tag} exclusiveTagIds={exclusiveTagIds.current}/>
          </Box>
        ))}
    </>
  );
};
