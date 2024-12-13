import { SvgIconComponent } from "@mui/icons-material";
import { Box, Switch, Typography } from "@mui/material";
import React from "react";
import { useVideoGallery } from "../../contexts/VideoGallery.context";
import scLogoMini from "../../../public/editor-hub-logo-mini-gray-scale.svg";
import { toggleFilterByTags } from "../../redux/slices/TagsSlice";
import { FileBrowser } from "./components/FileBrowser/FileBrowser";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from "../../redux/store";
import './VideoGallery.css'

export const VideoGallery: React.FC<{
  tabName: string;
  tabIcon: SvgIconComponent;
  proportion: number;
}> = () => {
  const dispatch = useDispatch()
  const { currentVideoSource } = useSelector((state: RootState) => state.videoGallery)
  const { filterByTags } = useSelector((state: RootState) => state.tags)

  const {
    videoPlayer,
  } = useVideoGallery();
  return (
    <Box
      component={"div"}
      id={"page:video-gallery:container"}
      data-testid={"page:video-gallery:container"}
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
          <Typography gridColumn={'2/3'}>In-game Footage</Typography>
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
    </Box>
  );
};
