import { Box, CircularProgress, Typography } from "@mui/material";
import { FileTreeNode } from "../../../types/app";
import { useEffect, useRef, useState } from "react";
import { Folder as Foldericon } from "@mui/icons-material";
import { File } from "./File";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import './Folder.css'
import { useFileBrowser } from "../../../contexts/FileBrowser.context";

export const Folder = ({
  fileTreeNode,
  nodeKey,
  isRootFolder = false,
  fetchUpFront,
  onClickCallback,
  onSourceChange
}: {
  fileTreeNode: FileTreeNode;
  nodeKey: number;
  isRootFolder?: boolean;
  fetchUpFront?: number
  onClickCallback?: (
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  ) => Promise<void>;
  onSourceChange: (fileTreeNode: FileTreeNode) => Promise<void>
}) => {
  const childrenContainer = useRef<HTMLUListElement>(null)
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [contentFetched, setContentFetched] = useState<boolean>(false)

  const { filterByTags, activeTags } = useSelector((state: RootState) => state.tags)

  const { tabIndex, setTabIndex } = useFileBrowser();

  const currentTabIndex = tabIndex;
  setTabIndex(currentValue => currentValue++)

  useEffect(() => {
    if (!isRootFolder) return setContentFetched(true);

    if (fileTreeNode.children && fileTreeNode.children.length > 0) {
      setIsLoading(false)
      setContentFetched(true);
      return
    }

    if ((fetchUpFront && nodeKey < fetchUpFront) || !fetchUpFront) return setIsLoading(true);
  }, [fileTreeNode])

  return (
    <>{(!filterByTags || fileTreeNode.filtered || activeTags.length === 0) &&
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
          <Foldericon sx={{ fill: 'hsl(213, 68%, 68%)' }}></Foldericon>
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
          }}
          className="folder-tab-size"
        >
          {fileTreeNode.children &&
            fileTreeNode.children.length > 0 &&
            fileTreeNode.children.map((childTreeNode, index) => (
              <>
                {childTreeNode.tag === "folder" && (
                  <Folder
                    fileTreeNode={childTreeNode}
                    onSourceChange={onSourceChange}
                    nodeKey={index}
                  ></Folder>
                )}
                {childTreeNode.tag === "file" && (
                  <File
                    fileTreeNode={childTreeNode}
                    onSourceChange={onSourceChange}
                    nodeKey={index}
                  ></File>
                )}
              </>
            ))}
        </Box>
      </Box>
    }</>
  );
};
