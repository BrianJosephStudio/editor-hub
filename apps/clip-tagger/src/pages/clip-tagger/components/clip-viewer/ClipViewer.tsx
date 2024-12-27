import { Box } from "@mui/material";
import { useClipViewer } from "../../../../context/ClipViewerContext";
import { useAppContext } from "../../../../context/AppContext";

const apiHost = import.meta.env.VITE_API_HOST;
const clipsRootPath = import.meta.env.VITE_CLIPS_ROOT_FOLDER as string;

if (!clipsRootPath || !apiHost) throw new Error("Missing envs");

export const ClipViewer = () => {
  const { currentVideoSource, videoPlayer } = useClipViewer();
  const { AppRoot } = useAppContext();

  return (
    <Box component={'div'} tabIndex={-1} sx={{ display: "flex", flexDirection: 'column', minHeight: '0', placeContent: 'center' }}>
      <video
        tabIndex={-1}
        autoPlay
        ref={videoPlayer}
        controls
        preload="auto"
        src={currentVideoSource}
        onFocus={(event) => {
           event.target.blur()
           AppRoot?.current?.focus()
        }}
        style={{
          minHeight: '0',
          minWidth: '0',
          outline: 'none',
        }}
      ></video>
    </Box>
  );
};
