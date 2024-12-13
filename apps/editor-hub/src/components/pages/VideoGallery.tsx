import { Sell, SvgIconComponent } from "@mui/icons-material";
import { Box, IconButton, Switch, Typography } from "@mui/material";
import React, { KeyboardEvent, useState } from "react";
import { useVideoGallery } from "../../contexts/VideoGallery.context";
import scLogoMini from "../../../public/editor-hub-logo-mini-gray-scale.svg";
import { toggleFilterByTags } from "../../redux/slices/TagsSlice";
import { FileBrowser } from "./components/FileBrowser/FileBrowser";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from "../../redux/store";
import './VideoGallery.css'
import { TagsProvider } from "../../contexts/Tags.context";
import { TagsDialog } from "../../modals/TagsModal";

export const VideoGallery: React.FC<{
  tabName: string;
  tabIcon: SvgIconComponent;
  proportion: number;
}> = () => {
  const dispatch = useDispatch()
  const { currentVideoSource } = useSelector((state: RootState) => state.videoGallery)
  const { filterByTags } = useSelector((state: RootState) => state.tags)
  const [tagsModalOpen, setTagModalOpen] = useState<boolean>(false)

  const {
    videoPlayer,
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
      }}
    >
      <Box
        ref={videoPlayer}
        component={"video"}
        controls
        autoPlay
        poster={scLogoMini}
        src={currentVideoSource?.temporary_link}
        id={"page:video-gallery:video-player"}
        data-testid={"page:video-gallery:video-player"}
        sx={{
          maxHeight: "50%",
        }}
      ></Box>
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
            display: 'grid',
            placeItems: 'center',
            gridTemplateColumns: '1fr 3fr 1fr',
            height: '3rem'
          }}
        >
          <IconButton onClick={() => setTagModalOpen(true)} sx={{'&:focus':{ outline: 'none'}}}>
            <Sell color={"primary"}></Sell>
          </IconButton>
          <Typography>In-game Footage</Typography>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
          }}>
            <Typography fontSize={'0.8rem'} className="hide-on-narrow-screen">Filter by Tags</Typography>
            <Switch checked={filterByTags} title="Filter by Tags" onChange={() => { dispatch(toggleFilterByTags()) }}></Switch>
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
