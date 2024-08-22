import { Box } from "@mui/material";
import { useClipViewer } from "../../context/ClipViewerContext";

const apiHost = import.meta.env.VITE_API_HOST;
const clipsRootPath = import.meta.env.VITE_CLIPS_ROOT_FOLDER as string;

if (!clipsRootPath || !apiHost) throw new Error("Missing envs");

export const ClipViewer = () => {
  const { currentVideoSource, videoPlayer } = useClipViewer();

  return (
    <Box sx={{ display: "flex", flexDirection: 'column', width: "100%", gridColumn: '1/4' }}>
      <video
        autoPlay
        ref={videoPlayer}
        controls
        preload="auto"
        src={currentVideoSource}
        style={{
          // maxWidth: "60rem",
          flexGrow: "1",
          maxHeight: '100%',
          outline: 'none',
        }}
      ></video>
    </Box>
  );
};
