import { SvgIconComponent } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import { ApiClient } from "../../api/ApiClient";
import React, { useEffect } from "react";
import { Folder } from "./components/Folder";
import { useVideoGallery } from "../../contexts/VideoGallery.context";
import { FileTreeNode } from "../../types/app";
import scLogoMini from "../../../public/editor-hub-logo-mini.svg";

const clipsRootPath = import.meta.env.VITE_CLIPS_ROOT_FOLDER as string;

export const VideoGallery: React.FC<{
  tabName: string;
  tabIcon: SvgIconComponent;
  proportion: number;
}> = () => {
  const apiClient = new ApiClient();

  const {
    currentVideoSource,
    fileTree,
    setFileTree,
    initialFetchDone,
    setinitialFetchDone,
    fetchUpfront,
    foldersRendered,
    setFoldersRendered,
    clipMetadataBatch,
    setClipMetadataBatch,
    resolveTreeStructure,
    videoPlayer,
  } = useVideoGallery();

  const fetchClickedFolder = async (
    currentFileTree: FileTreeNode,
    fileTreeNode: FileTreeNode
  ) => {
    if (!currentFileTree.children || currentFileTree.children.length === 0)
      return;

    const matchingFileTreeNode = currentFileTree.children.find(
      (childTreeNode) => {
        return childTreeNode.path === fileTreeNode.path;
      }
    );
    if (
      !matchingFileTreeNode ||
      (matchingFileTreeNode &&
        matchingFileTreeNode.children &&
        matchingFileTreeNode.children.length > 0)
    )
      return;

    const newMetadata = await apiClient.getFolderEntriesRecursively(
      fileTreeNode.metadata.path_lower
    );
    setClipMetadataBatch(newMetadata);
  };

  useEffect(() => {
    if (clipMetadataBatch.length === 0) return;
    const builtRoot = resolveTreeStructure(fileTree, clipMetadataBatch);
    setFileTree(builtRoot);
  }, [clipMetadataBatch]);

  useEffect(() => {
    if (initialFetchDone) {
      return;
    }
    (async () => {
      const clipMetadataBatch = await apiClient.getFolderEntries(clipsRootPath);
      const reversedClipMetadataBatch = clipMetadataBatch.reverse();
      setFoldersRendered(true);
      setClipMetadataBatch(reversedClipMetadataBatch);
    })();
  }, []);

  useEffect(() => {
    if (!foldersRendered || initialFetchDone) {
      return;
    }
    (async () => {
      const fetchedMetadataRaw = await Promise.all(
        fileTree.children!.map((fileTreeNode, index) => {
          if (index > fetchUpfront) return;

          return apiClient.getFolderEntriesRecursively(
            fileTreeNode.metadata.path_lower
          );
        })
      );
      const fetchedMetadata = fetchedMetadataRaw
        .flat()
        .filter((child) => !!child);

      setinitialFetchDone(true);
      setClipMetadataBatch(fetchedMetadata);
    })();
  }, [foldersRendered]);

  // useEffect(() => {videoPlayer.current?.pause()}, [activePage]);

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
            backgroundColor: "Gray",
            paddingY: "0.2rem",
          }}
        >
          <Typography>In-game Footage</Typography>
        </Box>
        <Box
          component={"ul"}
          id={"page:video-gallery-in-game-footage-browser:file-browser"}
          data-testid={
            "page:video-gallery-in-game-footage-browser:file-browser"
          }
          sx={{
            display: "flex",
            flexDirection: "column",
            padding: "0",
            margin: "0",
            overflowY: "scroll",
            "&::-webkit-scrollbar": {
              width: "0.5rem",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "gray",
              borderRadius: "0px",
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "transparent",
            },
            scrollbarWidth: "thin",
            "&": {
              scrollbarColor: "rgba(255, 255, 255, 0.5) transparent",
            },
          }}
        >
          {fileTree.children!.map((fileTreeNode, index) => (
            <Folder
              fileTreeNode={fileTreeNode}
              nodeKey={index}
              onClickCallback={async (setIsLoading) => {
                setIsLoading(true);
                await fetchClickedFolder(fileTree, fileTreeNode);
                setIsLoading(false);
              }}
            ></Folder>
          ))}
        </Box>
      </Box>
    </Box>
  );
};
