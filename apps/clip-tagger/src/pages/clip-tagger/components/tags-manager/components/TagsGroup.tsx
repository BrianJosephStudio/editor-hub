import { useEffect, useRef } from "react";
import { useAppContext } from "../../../../../context/AppContext";
import { useTags } from "../../../../../context/TagsContext";
import { Box, Typography } from "@mui/material";
import { Tag } from "./Tag";
import { useKeybind } from "../../../../../context/KeyBindContext";
import { useClipViewer } from "../../../../../context/ClipViewerContext";
import { TagGroup } from "@editor-hub/tag-system";

export const TagsGroup = ({
  tagsGroup,
  groupName,
  key,
}: {
  tagsGroup: TagGroup;
  groupName: string;
  key: number;
}) => {
  const { AppRoot } = useAppContext();
  const { selectedTagGroup, setSelectedTagGroup } = useTags();
  const {
    blockGroupLevelListeners,
    setBlockGroupLevelListeners,
    iterableTagListModifier,
    clipBrowserModifier,
  } = useKeybind();
  const { currentVideoSource, targetClip, setPauseOnInput, videoPlayer } = useClipViewer();

  const normalizedGroupName = groupName
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

  const exclusiveTagIds = useRef<string[] | undefined>(undefined);

  if (tagsGroup.exclusive) {
    exclusiveTagIds.current = tagsGroup.tags.map((tagObject) => tagObject.id);
  }

  const handleKeyBindPress = useRef((event: KeyboardEvent) => {
    if(event.ctrlKey || event.altKey || event.metaKey || event.shiftKey) return;
    if (
      event.key === tagsGroup.keybindGroup &&
      !blockGroupLevelListeners &&
      !iterableTagListModifier
    ) {
      setPauseOnInput((currentValue) => {
        if (!videoPlayer.current) return currentValue;
        if (currentValue) {
          videoPlayer.current.pause();
        }
        return currentValue;
      });
      setSelectedTagGroup(tagsGroup.id);
      setBlockGroupLevelListeners(true);
      return;
    }
  });

  const addKeyBindGroupListener = () => {
    if (!AppRoot || !AppRoot.current) return;
    AppRoot.current.addEventListener("keydown", handleKeyBindPress.current);
  };

  const removeKeyBindGroupListener = () => {
    if (!AppRoot || !AppRoot.current) return;
    AppRoot.current.removeEventListener("keydown", handleKeyBindPress.current);
  };

  useEffect(() => {
    if (
      blockGroupLevelListeners ||
      iterableTagListModifier ||
      clipBrowserModifier
    ) {
      removeKeyBindGroupListener();
    } else {
      if (!currentVideoSource || !targetClip) return;
      addKeyBindGroupListener();
    }
  }, [
    blockGroupLevelListeners,
    iterableTagListModifier,
    clipBrowserModifier,
    currentVideoSource,
  ]);

  return (
    <>
      {selectedTagGroup === null && (
        <Box
          key={key}
          sx={{
            display: "grid",
            gridTemplateRows: "2fr 4fr 2fr",
            padding: '0.6rem',
            borderRadius: "1rem",
            // flexGrow: "1",
            placeItems: "center",
            cursor: "pointer",
            // height: "100%",
            overflow: 'hidden',
            backgroundColor: "hsl(0, 0%, 18%)",
          }}
        >
          <Typography
            textAlign={"center"}
            sx={{ fontSize: "1rem", padding: "0 0 auto 0" }}
          >
            {normalizedGroupName}
          </Typography>
          <Typography
            textAlign={"center"}
            sx={{ fontSize: "3rem", fontWeight: "900", padding: "auto 0" }}
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
              backgroundColor: "#2772cc",
              width: "7rem",
              height: "5rem",
              borderRadius: "1rem",
              placeContent: "center",
            }}
          >
            <Tag tagObject={tag} exclusiveTagIds={exclusiveTagIds.current} />
          </Box>
        ))}
    </>
  );
};
