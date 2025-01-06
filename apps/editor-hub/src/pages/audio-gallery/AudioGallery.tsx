import { Audiotrack, ExpandLess, ExpandMore, GraphicEq } from "@mui/icons-material";
import { Box, IconButton, ListItemText, useMediaQuery } from "@mui/material";
import { List, ListItem } from '@mui/joy'
import { useAudioGallery } from "../../contexts/AudioGallery.context";
import { FileBrowser } from "../../components/FileBrowser/FileBrowser";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from "../../redux/store";
import { setNewMusicTrackTree, setNewSfxTrackTree } from "../../redux/slices/FileTreeSlice";
import { setNewAudioSource } from "../../redux/slices/AudioGallerySlice";
import { FileTreeNode } from "../../types/app";
import apiClient from "../../api/ApiClient";
import { useState } from "react";

const musicTracksRootPath = import.meta.env.VITE_MUSICTRACKS_ROOT_FOLDER as string;
const sfxRootPath = import.meta.env.VITE_SFX_ROOT_FOLDER as string;

if (!musicTracksRootPath || !sfxRootPath) throw new Error("Missing envs");


export const AudioGallery = () => {
  const dispatch = useDispatch()
  const { currentAudioSource } = useSelector((state: RootState) => state.audioGallery)
  const { musicTrackFileTree, sfxFileTree } = useSelector((state: RootState) => state.fileTree)
  const [tab, setTab] = useState<"music" | "sfx">("music")
  
  const isWideEnough = useMediaQuery('(min-width:22rem)')

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

          <List orientation="horizontal" sx={{ gap: '1rem', justifyContent: isWideEnough ? 'flex-start' : 'space-around' }}>

            <ListItem title={isWideEnough ? "": 'Music Tracks'} onClick={() => setTab('music')} sx={{
              color: 'white',
              opacity: tab === 'music' ? "1" : "0.4",
              cursor: 'pointer',
              gap: '0.3rem'
            }}>
              <Audiotrack sx={{ fill: 'white' }} />
              {isWideEnough && 
                <ListItemText>Music Tracks</ListItemText>
              }
            </ListItem>

            <ListItem title={isWideEnough ? "": 'Sound Effects'} onClick={() => setTab('sfx')} sx={{
              color: 'white',
              opacity: tab === 'sfx' ? "1" : "0.4",
              cursor: 'pointer',
              gap: '0.3rem'
            }}>
              <GraphicEq sx={{ fill: 'white' }} />
              {isWideEnough && 
                <ListItemText>Sound Effects</ListItemText>
              }
            </ListItem>

          </List>
        </Box>
        {tab === "music" &&
          <FileBrowser
            fileTree={musicTrackFileTree}
            rootPath={musicTracksRootPath}
            noFilter={true}
            setNewFileTree={(newFileTree) => dispatch(setNewMusicTrackTree(newFileTree))}
            onSourceChange={async (fileTreeNode) => {
              if (audioPlayer.current && audioPlayer.current.src) audioPlayer.current.src = "";

              setAudioPlayerExpanded(true)
              if (!fileTreeNode.temporary_link) {
                const temporary_link = await apiClient.getTemporaryLink(
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
          />
        }
        {tab === "sfx" &&
          <FileBrowser
            fileTree={sfxFileTree}
            rootPath={sfxRootPath}
            setNewFileTree={(newFileTree) => dispatch(setNewSfxTrackTree(newFileTree))}
            noFilter={true}
            onSourceChange={async (fileTreeNode) => {
              if (audioPlayer.current && audioPlayer.current.src) audioPlayer.current.src = "";

              setAudioPlayerExpanded(true)
              if (!fileTreeNode.temporary_link) {
                const temporary_link = await apiClient.getTemporaryLink(
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
          />}
      </Box>
    </Box>
  );
};
