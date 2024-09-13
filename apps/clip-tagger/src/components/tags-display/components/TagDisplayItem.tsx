import { Box, Typography } from "@mui/material";
import { useClipViewer } from "../../../context/ClipViewerContext";
import { TagObject, TagReference, TimeCode } from "../../../types/tags";
import { useEffect, useRef, useState } from "react";
import { useTags } from "../../../context/TagsContext";
import { Clear } from "@mui/icons-material";
import { ApiClient } from "../../../api/ApiClient";

export const TagDisplayItem = ({
  index,
  instanceId,
  tagObject,
  time,
}: {
  index: number;
  instanceId: string
  tagObject: TagObject;
  time: number;
}) => {
  const { videoPlayer, targetClip } = useClipViewer();
  const { tagDisplayList, tagReferenceMaster, setTagReferenceMaster, tagReferenceLabeled } = useTags();
  const [left, setLeft] = useState<number>(0);

  const body = useRef<HTMLDivElement | null>(null);

  function getPlaybackPercentage(currentTime: number, duration: number) {
    if (duration === 0) return 0;
    return (currentTime / duration) * 100;
  }

  useEffect(() => {
    if (!body.current || !tagDisplayList.current) return;
    
    const currentItem = tagDisplayList.current.children[index]
    const previousItem = tagDisplayList.current.children[index-1]
    if (!currentItem || !previousItem) return;
    const currentItemTagTitle = currentItem.children[1]
    const previousItemTagTitle = previousItem.children[1]
    if (!currentItemTagTitle || !previousItemTagTitle) return;

    const containerRect = tagDisplayList.current.getBoundingClientRect()
    const currentItemRect = currentItemTagTitle.getBoundingClientRect()
    const prevItemRect = previousItemTagTitle.getBoundingClientRect();
    const prevTagTitleRect = previousItemTagTitle.getBoundingClientRect();

    console.log("left", currentItemRect.left);

    if (prevItemRect.bottom >= currentItemRect.top) {
      setLeft(prevTagTitleRect.right - containerRect.left + 24);
    }
  }, []);

  return (
    <Box
      ref={body}
      sx={{
        position: "absolute",
        top: `calc(${getPlaybackPercentage(
          time,
          videoPlayer.current!.duration
        )}%)`,
        // backgroundColor: 'red',
        width: "100%",
        height: "1.6rem",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          width: "100%",
          border: "solid 1px",
          borderColor: "hsl(0, 0%, 40%)",
          top: "50%",
          maxHeight: "0",
          zIndex: 1,
        }}
      ></Box>
      <Box
        sx={{
          height: "1.6rem",
          backgroundColor: "black",
          paddingX: "1rem",
          borderRadius: "1rem",
          display: "flex",
          flexDirection: "column",
          placeContent: "center",
          position: "absolute",
          cursor: "pointer",
          left: `${left}px`,
          zIndex: 2,
        }}
        onClick={() => {
          console.log("click 2!")
        }}
      >
        <Typography>{tagObject.displayName}</Typography>
        <Clear
          fontSize="small"
          sx={{
            position: "absolute",
            left: "100%",
            bottom: "50%",
            fill: "hsl(0,100%,100%)",
            '&:hover': {
              fill: "hsl(0,70%,60%)",
            }
          }}
          onClick={async (event) => {
            event.stopPropagation()
            const tagEntry = tagReferenceLabeled[tagObject.id]
            if(!tagEntry) return
            const filteredTagEntry = tagEntry.filter(timeEntry => timeEntry.instanceId !== instanceId)
            const newTagEntry: TimeCode[] = filteredTagEntry.map(timeEntry => timeEntry.time)

            const apiClient = new ApiClient()
            const newTagReference = await apiClient.removeTag(targetClip, tagObject.id, newTagEntry)
            console.log("newTagReference:", newTagReference)
            setTagReferenceMaster(newTagReference)
          }}
        ></Clear>
      </Box>
    </Box>
  );
};
