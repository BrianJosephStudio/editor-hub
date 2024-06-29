import { Box } from "@mui/material";
import { useClipViewer } from "../../context/ClipViewerContext";
import { useEffect, useRef } from "react";

const apiHost = import.meta.env.VITE_API_HOST;
const clipsRootPath = import.meta.env.VITE_CLIPS_ROOT_FOLDER as string;

if (!clipsRootPath || !apiHost) throw new Error("Missing envs");

export const ClipViewer = () => {
  const { currentVideoSource } = useClipViewer();

  const videoElement = useRef<HTMLVideoElement>(null);

  return (
    <Box sx={{ display: "flex", flexDirection: 'column', width: "100%", gridColumn: '1/4' }}>
      <video
        autoPlay
        ref={videoElement}
        controls
        preload="auto"
        src={currentVideoSource}
        style={{
          // maxWidth: "60rem",
          flexGrow: "1",
          maxHeight: '100%'
        }}
      ></video>
    </Box>
  );
};
