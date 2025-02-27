import { Bookmark, BookmarkBorder, ExpandLess, ExpandMore, SportsEsports, Widgets } from "@mui/icons-material";
import { Box, Checkbox, FormControlLabel, IconButton, ListItemText, Stack, Typography, useMediaQuery } from "@mui/material";
import { List, ListItem } from "@mui/joy";
import { KeyboardEvent, useState } from "react";
import { useVideoGallery } from "../../contexts/VideoGallery.context";
import { toggleFilterByTags } from "../../redux/slices/TagsSlice";
import { FileBrowser } from "../../components/FileBrowser/FileBrowser";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from "../../redux/store";
import { TagsProvider } from "../../contexts/Tags.context";
import { TagsDialog } from "../../modals/TagsModal";
import { selectFilteredIngameFootageFileTree } from "../../redux/selectors/FileTreeSelector";
import { setNewInGameFootageTree } from "../../redux/slices/FileTreeSlice";
import apiClient from "../../api/ApiClient";
import { FileTreeNode } from "../../types/app";
import { setNewVideoSource } from "../../redux/slices/VideoGallerySlice";
import { GenericTags } from "@editor-hub/tag-system";

const ingameFootageRootPath = import.meta.env.VITE_INGAME_FOOTAGE_ROOT_FOLDER as string;

if (!ingameFootageRootPath) throw new Error("Missing envs");

export const VideoGallery = () => {
  const dispatch = useDispatch()
  const { currentVideoSource, settings: { fetchUpFront } } = useSelector((state: RootState) => state.videoGallery)
  const { filterByTags } = useSelector((state: RootState) => state.tags)
  const filteredFileTree = useSelector(selectFilteredIngameFootageFileTree)

  const [tagsModalOpen, setTagModalOpen] = useState<boolean>(false)

  const isWideEnough = useMediaQuery('(min-width: 38rem)')
  const tabBreakingPoint = useMediaQuery('(min-width: 31rem)')

  const {
    videoPlayer,
    videoPlayerExpanded,
    setVideoPlayerExpanded,
  } = useVideoGallery();

  const tagModalToggleListener = (event: KeyboardEvent) => {
    if (event.key === "t") {
      setTagModalOpen(currentValue => !currentValue)
    }
  }

  return (
    <Box
      component={"div"}
      id={"page:video-gallery:container"}
      data-testid={"page:video-gallery:container"}
      onKeyDown={tagModalToggleListener}
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "0",
        maxWidth: '100vw',
      }}
    >
      {!!videoPlayerExpanded &&
        <Box
          ref={videoPlayer}
          component={"video"}
          controls
          autoPlay
          // poster={scLogoMini}
          src={currentVideoSource?.temporary_link}
          id={"page:video-gallery:video-player"}
          data-testid={"page:video-gallery:video-player"}
          sx={{
            maxHeight: "50%",
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
            if (!videoPlayer.current?.src) return;
            if (videoPlayer.current!.paused) {
              return videoPlayer.current?.play();
            }
            videoPlayer.current!.pause();
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
            height: '3rem',
          }}
        >
          {!videoPlayerExpanded &&
            <IconButton title="Show Player" onClick={() => setVideoPlayerExpanded(true)} sx={{ '&:focus': { outline: 'none' } }}>
              <ExpandMore fontSize={"large"} color={"primary"} sx={{ maxHeight: '2rem' }}></ExpandMore>
            </IconButton>
          }
          {videoPlayerExpanded &&
            <IconButton title="Hide Player" onClick={() => setVideoPlayerExpanded(false)} sx={{ '&:focus': { outline: 'none' } }}>
              <ExpandLess fontSize={"large"} color={"primary"} sx={{ maxHeight: '2rem' }}></ExpandLess>
            </IconButton>
          }

          <List orientation="horizontal" sx={{ flexGrow: 0, padding: 0, gap: '1rem', justifyContent: tabBreakingPoint ? 'flex-start' : 'space-around' }}>
            <ListItem title={tabBreakingPoint ? "" : "In-game Footage"}
              sx={{
                color: 'white',
                cursor: 'pointer',
                gap: '0.3rem'
              }}>
              <SportsEsports sx={{ fill: 'white' }} />
              {tabBreakingPoint && <ListItemText>In-game Footage</ListItemText>}
            </ListItem>
          </List>

          {currentVideoSource && currentVideoSource.name && <Typography sx={{marginX: 'auto'}}>{currentVideoSource.name}</Typography>}

          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            marginLeft: 'auto',
          }}>
            <FormControlLabel
              label={
                isWideEnough ? <Typography fontSize={'0.8rem'}>Tags Menu</Typography> : null
              }
              control={
                <IconButton title="Show Tags Menu" onClick={() => setTagModalOpen(true)} sx={{ '&:focus': { outline: 'none' } }}>
                  <Widgets color={"primary"} sx={{ maxHeight: '2rem' }}></Widgets>
                </IconButton>
              }
            ></FormControlLabel>
            <FormControlLabel
              label={
                isWideEnough ? <Typography fontSize={'0.8rem'}>Filter by tags</Typography> : null
              }
              control={
                <Checkbox title="Filter by tags" checked={filterByTags} icon={<BookmarkBorder color="primary" />} checkedIcon={<Bookmark />} onChange={() => { dispatch(toggleFilterByTags()) }}></Checkbox>
              }
            ></FormControlLabel>
          </Box>
        </Box>
        <FileBrowser
          fileTree={filteredFileTree}
          fileTreeName={'inGameFootage'}
          rootPath={ingameFootageRootPath}
          fetchUpFront={fetchUpFront}
          genericTags={GenericTags}
          setNewFileTree={(newFileTree) => dispatch(setNewInGameFootageTree(newFileTree))
          }
          onSourceChange={async (fileTreeNode) => {
            if (videoPlayer.current && videoPlayer.current.src) videoPlayer.current.src = "";

            setVideoPlayerExpanded(true)
            if (!fileTreeNode.temporary_link) {
              const temporary_link = await apiClient.getTemporaryLink(
                fileTreeNode.metadata!.path_lower!
              );
              const newFileTreeNode: FileTreeNode = {
                ...fileTreeNode,
                temporary_link
              }
              dispatch(setNewVideoSource(newFileTreeNode))
            } else {
              dispatch(setNewVideoSource(fileTreeNode))
            }
          }}
        ></FileBrowser>
      </Box>
      <TagsProvider>
        <TagsDialog open={tagsModalOpen} closeTagsModal={() => setTagModalOpen(false)}></TagsDialog>
      </TagsProvider>
    </Box>
  );
};
