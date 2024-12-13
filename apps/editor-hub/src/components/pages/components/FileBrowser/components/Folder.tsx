import { Box, CircularProgress, Typography } from "@mui/material";
import { FileTreeNode } from "../../../../../types/app";
import { useEffect, useRef, useState } from "react";
import { Folder as Foldericon } from "@mui/icons-material";
import { File } from "./File";
import { useVideoGallery } from "../../../../../contexts/VideoGallery.context";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store";
import { selectFilteredFileTree } from "../../../../../redux/selectors/FileTreeSelector";

export const Folder = ({
  fileTreeNode,
  nodeKey,
  isRootFolder = false,
  onClickCallback,
}: {
  fileTreeNode: FileTreeNode;
  nodeKey: number;
  isRootFolder?: boolean;
  onClickCallback?: (
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  ) => Promise<void>;
}) => {
  const childrenContainer = useRef<HTMLUListElement>(null)
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [contentFetched, setContentFetched] = useState<boolean>(false)

  const filteredFileTree = useSelector(selectFilteredFileTree)
  const { settings:{fetchUpfront} } = useSelector((state: RootState) => state.videoGallery)
  
  const { tabIndex, setTabIndex } = useVideoGallery();

  const currentTabIndex = tabIndex;
  setTabIndex(currentValue => currentValue++)

  useEffect(() => {
    if (!isRootFolder) setContentFetched(true)
    if (isRootFolder && fileTreeNode.children && fileTreeNode.children.length > 0) {
      setIsLoading(false)
      setContentFetched(true);
      return
    }

    if(filteredFileTree && filteredFileTree.children){
      const fetchedUpfrontChildren = [...filteredFileTree.children].filter((_, index) => index < fetchUpfront)
      if(fetchedUpfrontChildren.find(entry => entry.name === fileTreeNode.name)){
        setIsLoading(true)
      }
    }
  }, [filteredFileTree])

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
            opacity: contentFetched ? 1 : 0.5
          }}
        >
          <Box
            component={"div"}
            tabIndex={currentTabIndex}
            onClick={() => {
              setIsOpen(!isOpen);
              if (!onClickCallback) return;
              onClickCallback(setIsLoading);
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.stopPropagation();
                event.preventDefault();
                setIsOpen((currentValue) => !currentValue);
              }
            }}
            sx={{
              display: "flex",
              flexGrow: "1",
              paddingY: "0.3rem",
              paddingLeft: "0.4rem",
              placeItems: "center",
              gap: "0.3rem",
              "&:hover": {
                backgroundColor: "hsla(0, 0%, 100%, 0.1)",
              },
              "&:focus": {
                backgroundColor: "hsla(0,0%,100%, 0.15)",
                outline: "none",
              },
            }}
          >
            <Foldericon sx={{fill: 'hsl(213, 68%, 68%)'}}></Foldericon>
            <Typography>{fileTreeNode.name}</Typography>
            {isLoading && (
              // @ts-ignore
              <CircularProgress size={16} color="action"></CircularProgress>
            )}
          </Box>
          <Box
            ref={childrenContainer}
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
