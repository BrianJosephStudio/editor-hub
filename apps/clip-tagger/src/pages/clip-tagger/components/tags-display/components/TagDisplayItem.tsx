import { Box, Typography } from "@mui/material";
import { useClipViewer } from "../../../../../context/ClipViewerContext";
import { TagObject } from "../../../../../types/tags";
import { useRef } from "react";
import { useTags } from "../../../../../context/TagsContext";
import { Clear } from "@mui/icons-material";

export const TagDisplayItem = ({
  index,
  instanceId,
  tagObject,
  time,
  top,
  left,
  mouseEnterCallback,
  mouseLeaveCallback,
}: {
  index: number;
  instanceId: string;
  tagObject: TagObject;
  time: number;
  top: number;
  left: number;
  mouseEnterCallback: (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => void;
  mouseLeaveCallback: (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => void;
}) => {
  const { videoPlayer } = useClipViewer();
  const { removeTag } = useTags();

  const body = useRef<HTMLDivElement | null>(null);

  return (
    <Box
      key={index}
      component={"div"}
      id="tag-display-item"
      ref={body}
      sx={{
        position: "absolute",
        top: `${top}px`,
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
        component={"div"}
        sx={{
          height: "1.6rem",
          // backgroundColor: "hsl(0, 0%, 12%)",
          backgroundColor: "#2265b5",
          paddingX: "0.6rem",
          gap: "0.3rem",
          borderRadius: "0.8rem",
          placeItems: "center",
          display: "flex",
          placeContent: "center",
          position: "absolute",
          cursor: "pointer",
          left: `${left}px`,
          zIndex: 2,
          overflow: "hidden",
          color: "white",
          "&:hover": {
            color: "black",
            backgroundColor: "hsl(0, 0%, 90%)",
          },
        }}
        onMouseEnter={(e) => {
          mouseEnterCallback(e);
        }}
        onMouseLeave={(e) => {
          mouseLeaveCallback(e);
        }}
        onClick={() => {
          videoPlayer.current!.currentTime = time;
        }}
      >
        <Typography>{tagObject.displayName}</Typography>
        <Clear
          titleAccess="Remove Tag"
          fontSize="small"
          sx={{
            maxHeight: "1rem",
            fill: "black",
            "&:hover": {
              fill: "hsl(0,70%,60%)",
            },
          }}
          onClick={async (event) => {
            event.stopPropagation();
            removeTag(tagObject, instanceId);
          }}
        ></Clear>
      </Box>
    </Box>
  );
};
