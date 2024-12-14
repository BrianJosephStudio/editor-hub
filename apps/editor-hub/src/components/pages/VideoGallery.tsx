import { Bookmark, BookmarkBorder, ExpandLess, ExpandMore, Widgets } from "@mui/icons-material";
import { Box, Checkbox, FormControlLabel, IconButton, Typography, useMediaQuery } from "@mui/material";
import { KeyboardEvent, useState } from "react";
import { useVideoGallery } from "../../contexts/VideoGallery.context";
import { toggleFilterByTags } from "../../redux/slices/TagsSlice";
import { FileBrowser } from "./components/FileBrowser/FileBrowser";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from "../../redux/store";
import './VideoGallery.css'
import { TagsProvider } from "../../contexts/Tags.context";
import { TagsDialog } from "../../modals/TagsModal";

export const VideoGallery = () => {
  const dispatch = useDispatch()
  const { currentVideoSource } = useSelector((state: RootState) => state.videoGallery)
  const { filterByTags } = useSelector((state: RootState) => state.tags)
  const [tagsModalOpen, setTagModalOpen] = useState<boolean>(false)

  const isWideEnough = useMediaQuery('(min-width: 30rem)')

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
            gridTemplateColumns: '1fr 3fr 1fr',
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
          <Typography>In-game Footage</Typography>

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
        <FileBrowser></FileBrowser>
      </Box>
      <TagsProvider>
        <TagsDialog open={tagsModalOpen} closeTagsModal={() => setTagModalOpen(false)}></TagsDialog>
      </TagsProvider>
    </Box>
  );
};
