import { Box } from "@mui/material";
import { useClipViewer } from "../../../../context/ClipViewerContext";
import { useAppContext } from "../../../../context/AppContext";
import { useEffect } from "react";

const apiHost = import.meta.env.VITE_API_HOST;
const clipsRootPath = import.meta.env.VITE_CLIPS_ROOT_FOLDER as string;

if (!clipsRootPath || !apiHost) throw new Error("Missing envs");

export const ClipViewer = () => {
  const { currentVideoSource, videoPlayer, currentVolume } = useClipViewer();
  const { AppRoot } = useAppContext();

  useEffect(() => {
    if (!videoPlayer.current) return;

    videoPlayer.current.volume = currentVolume
  }, [currentVolume])

  return (
    <Box
      component={'div'}
      tabIndex={-1}
      sx={{
        display: "flex",
        flexDirection: 'column',
        minHeight: '0',
        placeContent: 'center'
      }}
      onClick={() => {
        videoPlayer.current?.paused
          ? videoPlayer.current?.play()
          : videoPlayer.current?.pause();
      }}
    >
      <video
        tabIndex={-1}
        autoPlay
        ref={videoPlayer}
        // controls
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
