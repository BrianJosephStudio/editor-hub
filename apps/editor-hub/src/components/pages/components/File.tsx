import { Box, Typography } from "@mui/material";
import { FileTreeNode } from "../../../types/app";
import { Download, PlayArrow, Theaters } from "@mui/icons-material";
import { useVideoGallery } from "../../../contexts/VideoGallery.context";
import { useState } from "react";

export const File = ({
  fileTreeNode,
  nodeKey,
}: {
  fileTreeNode: FileTreeNode;
  nodeKey: number;
}) => {
  const {currentTabIndex, setCurrentTabIndex } = useVideoGallery()
  const [ selectedItem, setSelectedFile]  = useState(false)
  const tabIndex = currentTabIndex
  setCurrentTabIndex(current => current++)
  return (
    <Box
      component={"li"}
      tabIndex={tabIndex}
      key={nodeKey}
      onFocus={() => setSelectedFile(true)}
      onBlur={() => setSelectedFile(false)}
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
          backgroundColor: selectedItem ?  "hsla(0, 0%, 100%, 0.25)": "none",
          "&:hover": {
            backgroundColor: selectedItem ?  "hsla(0, 0%, 100%, 0.25)": "hsla(0, 0%, 100%, 0.20)",
          },
        }}
      >
        <Theaters></Theaters>
        <Typography>{fileTreeNode.name}</Typography>
        <Box
          sx={{
            display: "flex",
            marginLeft: "auto",
            marginRight: '2rem',
            gap: '0.3rem'
          }}
        >
          <PlayArrow fontSize="small" sx={{
            '&:hover': {
              fill: '#2265b5'
            }
          }}></PlayArrow>
          <Download fontSize="small" sx={{
            '&:hover': {
              fill: '#2265b5'
            }
          }}></Download>
        </Box>
      </Box>
    </Box>
  );
};
