import { Box } from "@mui/material";
import { useClipViewer } from "../../context/ClipViewerContext";

const apiHost = import.meta.env.VITE_API_HOST;
const clipsRootPath = import.meta.env.VITE_CLIPS_ROOT_FOLDER as string;

if (!clipsRootPath || !apiHost) throw new Error("Missing envs");

export const ClipViewer = () => {
  const { currentVideoSource, videoPlayer } = useClipViewer();

  return (
    <Box sx={{ display: "flex", flexDirection: 'column', minHeight: '0', placeContent: 'center' }}>
      <video
        autoPlay
        ref={videoPlayer}
        controls
        preload="auto"
        src={currentVideoSource}
        style={{
          minHeight: '0',
          minWidth: '0',
          outline: 'none',
        }}
      ></video>
    </Box>
  );
};
