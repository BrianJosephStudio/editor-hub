import { Box, CircularProgress, Typography } from "@mui/material";
import { FileTreeNode } from "../../../types/app";
import { useState } from "react";
import { Folder as Foldericon, MaximizeTwoTone } from "@mui/icons-material";
import { File } from "./File";
import { useVideoGallery } from "../../../contexts/VideoGallery.context";

export const Folder = ({
  fileTreeNode,
  nodeKey,
  onClickCallback,
}: {
  fileTreeNode: FileTreeNode;
  nodeKey: number;
  onClickCallback?: (
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
  ) => Promise<void>;
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { currentTabIndex, setCurrentTabIndex } = useVideoGallery();

  const tabIndex = currentTabIndex;
  setCurrentTabIndex((current) => current++);

  return (
    <Box
      component={"li"}
      id={"file-browser:folder:container"}
      data-testid={"file-browser:folder:container"}
      key={nodeKey}
      sx={{
        display: "flex",
        flexDirection: "column",
        cursor: "pointer",
      }}
    >
      <Box
        component={"div"}
        tabIndex={tabIndex}
        onClick={() => {
          setIsOpen(!isOpen);
          if (!onClickCallback) return;
          onClickCallback(setIsLoading);
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.stopPropagation()
            event.preventDefault()
            setIsOpen((currentValue) => !currentValue)
          };
        }}
        sx={{
          display: "flex",
          flexGrow: "1",
          paddingY: "0.3rem",
          paddingLeft: "0.4rem",
          placeItems: "center",
          gap: "0.3rem",
          "&:hover": {
            backgroundColor: "hsla(0, 0%, 100%, 0.2)",
          },
        }}
      >
        <Foldericon></Foldericon>
        <Typography>{fileTreeNode.name}</Typography>
        {isLoading && <CircularProgress size={16}></CircularProgress>}
      </Box>
      <Box
        component={"ul"}
        id={"file-browser:folder:children"}
        data-testid={"file-browser:folder:children"}
        sx={{
          flexGrow: "1",
          display: isOpen ? "flex" : "none",
          flexDirection: "column",
          paddingLeft: "1rem",
        }}
      >
        {fileTreeNode.children &&
          fileTreeNode.children.length > 0 &&
          fileTreeNode.children.map((childTreeNode, index) => (
            <>
              {childTreeNode.tag === "folder" && (
                <Folder fileTreeNode={childTreeNode} nodeKey={index}></Folder>
              )}
              {childTreeNode.tag === "file" && (
                <File fileTreeNode={childTreeNode} nodeKey={index}></File>
              )}
            </>
          ))}
      </Box>
    </Box>
  );
};
