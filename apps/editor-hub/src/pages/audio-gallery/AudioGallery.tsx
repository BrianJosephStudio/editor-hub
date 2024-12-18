import { ExpandLess, ExpandMore, } from "@mui/icons-material";
import { Box, IconButton, Typography, } from "@mui/material";
import { useAudioGallery } from "../../contexts/AudioGallery.context";
import { FileBrowser } from "../../components/FileBrowser/FileBrowser";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from "../../redux/store";
import { setNewSoundTrackTree } from "../../redux/slices/FileTreeSlice";
import { setNewAudioSource } from "../../redux/slices/AudioGallerySlice";
import { FileTreeNode } from "../../types/app";
import { ApiClient } from "../../api/ApiClient";

const soundTracksRootPath = import.meta.env.VITE_SOUNDTRACKS_ROOT_FOLDER as string;

if (!soundTracksRootPath) throw new Error("Missing envs");

export const AudioGallery = () => {
  const dispatch = useDispatch()
  const { currentAudioSource } = useSelector((state: RootState) => state.audioGallery)
  const { soundTrackFileTree } = useSelector((state: RootState) => state.fileTree)
  const { genericTags } = useSelector((state: RootState) => state.tags)

  const {
    audioPlayer,
    audioPlayerExpanded,
    setAudioPlayerExpanded,
  } = useAudioGallery();

  return (
    <Box
      component={"div"}
      id={"page:video-gallery:container"}
      data-testid={"page:video-gallery:container"}
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "0",
        maxWidth: '100vw',
      }}
    >
      {!!audioPlayerExpanded &&
        <Box
          ref={audioPlayer}
          component={"audio"}
          controls
          autoPlay
          src={currentAudioSource?.temporary_link}
          id={"page:video-gallery:video-player"}
          data-testid={"page:video-gallery:video-player"}
          sx={{
            maxHeight: "50%",
            width: '100%'
          }}
        ></Box>
      }
      <Box
        component={"div"}
        tabIndex={-1}
        id={"page:video-gallery:in-game-footage-browser:container"}
        data-testid={"page:video-gallery:in-game-footage-browser:container"}
        sx={{
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          outline: "none",
        }}
        onKeyDown={(event) => {
          if (event.key === " ") {
            event.preventDefault();
            event.stopPropagation;
            if (!audioPlayer.current?.src) return;
            if (audioPlayer.current!.paused) {
              return audioPlayer.current?.play();
            }
            audioPlayer.current!.pause();
          }
        }}
      >
        <Box
          component={"div"}
          id={"page:video-gallery-in-game-footage-browser:banner"}
          data-testid={"page:video-gallery-in-game-footage-browser:banner"}
          sx={{
            display: 'flex',
            placeItems: 'center',
            gridTemplateColumns: '1fr 3fr 1fr',
            height: '3rem',
          }}
        >
          {!audioPlayerExpanded &&
            <IconButton title="Show Player" onClick={() => setAudioPlayerExpanded(true)} sx={{ '&:focus': { outline: 'none' } }}>
              <ExpandMore fontSize={"large"} color={"primary"} sx={{ maxHeight: '2rem' }}></ExpandMore>
            </IconButton>
          }
          {audioPlayerExpanded &&
            <IconButton title="Hide Player" onClick={() => setAudioPlayerExpanded(false)} sx={{ '&:focus': { outline: 'none' } }}>
              <ExpandLess fontSize={"large"} color={"primary"} sx={{ maxHeight: '2rem' }}></ExpandLess>
            </IconButton>
          }
          <Typography>Sound Tracks</Typography>
        </Box>
        <FileBrowser
          fileTree={soundTrackFileTree}
          rootPath={soundTracksRootPath}
          genericTags={genericTags}
          setNewFileTree={(newFileTree) => dispatch(setNewSoundTrackTree(newFileTree))
          }
          onSourceChange={async (fileTreeNode) => {
            if (audioPlayer.current && audioPlayer.current.src) audioPlayer.current.src = "";

            setAudioPlayerExpanded(true)
            if (!fileTreeNode.temporary_link) {
              const apiClient = new ApiClient();
              const temporary_link = await apiClient.getTemporaryLink(
                soundTracksRootPath,
                fileTreeNode.metadata!.path_lower!
              );
              const newFileTreeNode: FileTreeNode = {
                ...fileTreeNode,
                temporary_link
              }
              dispatch(setNewAudioSource(newFileTreeNode))
            } else {
              dispatch(setNewAudioSource(fileTreeNode))
            }
          }}
        ></FileBrowser>
      </Box>
    </Box>
  );
};
