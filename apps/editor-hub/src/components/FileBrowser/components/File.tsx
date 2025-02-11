import { Box, CircularProgress, Typography } from "@mui/material";
import { FileTreeNode } from "../../../types/app";
import { Audiotrack, Download, PlayArrow, Theaters } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { Resource } from "../../../business-logic/Resource";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { useFileBrowser } from "../../../contexts/FileBrowser.context";
import { getMimeType } from "../../../util/fileType";
import { useSettings } from "../../../contexts/Settings.context";

export const File = ({
  fileTreeNode,
  nodeKey,
  onSourceChange
}: {
  fileTreeNode: FileTreeNode;
  nodeKey: number;
  onSourceChange: (fileTreeNode: FileTreeNode) => Promise<void>
}) => {
  const { filterByTags, activeTags } = useSelector((state: RootState) => state.tags)

  const {downloadLocation} = useSettings()
  const { tabIndex, setTabIndex } = useFileBrowser();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [fileType, setFileType] = useState<"video" | "image" | "audio" | undefined>()

  const currentTabIndex = tabIndex;
  setTabIndex(currentValue => currentValue++)

  const playVideo = async (
  ) => {
    setIsLoading(true);
    await onSourceChange(fileTreeNode)
    setIsLoading(false);
  };

  useEffect(() => {
    const type = getMimeType(fileTreeNode.name);

    if (type === 'audio' || type === 'video' || type === 'image') {
      setFileType(type);
    }
  })

  return (
    <>{(!filterByTags || fileTreeNode.filtered || activeTags.length === 0) &&
      <Box
        component={"li"}
        tabIndex={currentTabIndex}
        key={nodeKey}
        onDoubleClick={() => {
          const selection = window.getSelection();
          if (selection) {
            selection.removeAllRanges();
          }
          playVideo();
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            event.stopPropagation();
            playVideo();
          }
        }}
        sx={{
          display: "flex",
          flexDirection: "column",
          cursor: "pointer",
          "&:hover": {
            backgroundColor: "hsla(0, 0%, 100%, 0.1)",
          },
          "&:focus": {
            backgroundColor: "hsla(0,0%,100%, 0.15)",
            outline: "none",
          },
        }}
      >
        <Box
          component={"div"}
          id={"file-browser:file:container"}
          data-testid={"file-browser:file:container"}
          sx={{
            display: "flex",
            alignItems: "center",
            flexGrow: "1",
            paddingY: "0.3rem",
            paddingLeft: "0.4rem",
            gap: "0.3rem",
          }}
        >
          { fileType === "video" && 
            <Theaters sx={{ fill: 'white)' }}/>
          }
          { fileType === "audio" && 
            <Audiotrack sx={{ fill: 'white)' }}/>
          }
          <Typography>{fileTreeNode.name}</Typography>
          {isLoading && (
            <CircularProgress
              size={16}
              // @ts-ignore
              color="action"
              sx={{ fill: "white" }}
            ></CircularProgress>
          )}
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
                playVideo();
              }}
              fontSize="small"
              sx={{
                "&:hover": {
                  fill: "#2265b5",
                },
              }}
            ></PlayArrow>
            <Download
              onClick={async () => {
                setIsLoading(true);
                const resource = await Resource.getInstance(
                  fileTreeNode,
                  downloadLocation
                );
                await resource.download();
                await resource.import();
                setIsLoading(false);
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
    }</>
  );
};
