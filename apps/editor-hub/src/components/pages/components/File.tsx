import { Box, CircularProgress, Typography } from "@mui/material";
import { FileTreeNode } from "../../../types/app";
import { Download, PlayArrow, Theaters } from "@mui/icons-material";
import { useVideoGallery } from "../../../contexts/VideoGallery.context";
import { useState } from "react";
import { Resource } from "../../../business-logic/Resource";
import { AppPaths } from "../../../business-logic/AppPaths";

export const File = ({
  fileTreeNode,
  nodeKey,
}: {
  fileTreeNode: FileTreeNode;
  nodeKey: number;
}) => {
  const { currentTabIndex, setCurrentTabIndex, playVideo } = useVideoGallery();
  const [selectedItem, setSelectedFile] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const tabIndex = currentTabIndex;
  setCurrentTabIndex((current) => current++);

  return (
    <Box
      component={"li"}
      tabIndex={tabIndex}
      key={nodeKey}
      onFocus={() => setSelectedFile(true)}
      onBlur={() => setSelectedFile(false)}
      onDoubleClick={() => {
        const selection = window.getSelection();
        if (selection) {
          selection.removeAllRanges();
        }
        playVideo(fileTreeNode, setIsLoading);
      }}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          event.preventDefault()
          event.stopPropagation()
          playVideo(fileTreeNode, setIsLoading)
        };
      }}
      sx={{
        display: "flex",
        flexDirection: "column",
        // placeItems: "flex-start",
        // paddingLeft: "1rem",
        cursor: "pointer",
      }}
    >
      <Box
        component={"div"}
        id={"file-browser:file:container"}
        data-testid={"file-browser:file:container"}
        sx={{
          display: "flex",
          flexGrow: "1",
          paddingY: "0.3rem",
          paddingLeft: "0.4rem",
          gap: "0.3rem",
          backgroundColor: selectedItem ? "hsla(0, 0%, 100%, 0.25)" : "none",
          "&:hover": {
            backgroundColor: selectedItem
              ? "hsla(0, 0%, 100%, 0.25)"
              : "hsla(0, 0%, 100%, 0.20)",
          },
        }}
      >
        <Theaters></Theaters>
        <Typography>{fileTreeNode.name}</Typography>
        {isLoading && <CircularProgress size={16}></CircularProgress>}
        <Box
          sx={{
            display: "flex",
            marginLeft: "auto",
            marginRight: "2rem",
            gap: "0.3rem",
          }}
        >
          <PlayArrow
            onClick={() => {
              playVideo(fileTreeNode, setIsLoading);
            }}
            fontSize="small"
            sx={{
              "&:hover": {
                fill: "#2265b5",
              },
            }}
          ></PlayArrow>
          <Download
            onClick={() => {
              const appPaths = new AppPaths()
              const resource = new Resource(fileTreeNode, appPaths.inGameFootage)
              resource.download()
            }}
            fontSize="small"
            sx={{
              "&:hover": {
                fill: "#2265b5",
              },
            }}
          ></Download>
        </Box>
      </Box>
    </Box>
  );
};
