import { SvgIconComponent } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import { ApiClient } from "../../api/ApiClient";
import React, { useEffect } from "react";
import { Metadata } from "../../types/dropbox";
import { FileTreeNode } from "../../types/app";
import { Folder } from "./components/Folder";
import { useVideoGallery } from "../../contexts/VideoGallery.context";

const clipsRootPath = import.meta.env.VITE_CLIPS_ROOT_FOLDER as string;

export const VideoGallery: React.FC<{
  tabName: string;
  tabIcon: SvgIconComponent;
  proportion: number;
}> = () => {
  const apiClient = new ApiClient();

  const {
    fileTree,
    setFileTree,
    initialFetchDone,
    setinitialFetchDone,
    fetchUpfront,
    foldersRendered,
    setFoldersRendered,
    clipMetadataBatch,
    setClipMetadataBatch,
  } = useVideoGallery();

  const getMetadataPath = (path: string) => {
    return path.replace(clipsRootPath.toLowerCase(), "");
  };

  const resolveTreeStructure = (
    currentFileTreeNode: FileTreeNode,
    newMetadata: Metadata[]
  ): FileTreeNode => {
    const currentHead = currentFileTreeNode.path;

    const children: FileTreeNode[] = newMetadata
      .map((metadata) => {
        const currentHeadLength = currentHead.split("/").filter(Boolean).length;

        const metadataPath = getMetadataPath(metadata.path_lower!);
        const metadataLength = metadataPath.split("/").filter(Boolean).length;

        const parentFolder = metadataPath.replace(/\/[^/]*$/, "");

        if (
          (currentHeadLength === 0 && metadataLength === 1) ||
          parentFolder === currentHead
        ) {
          let newFileTreeNode: FileTreeNode = {
            name: metadata.name,
            tag: metadata[".tag"],
            path: getMetadataPath(metadata.path_lower!),
            metadata,
          };

          if (newFileTreeNode.tag === "folder") {
            newFileTreeNode = resolveTreeStructure(
              newFileTreeNode,
              newMetadata
            );
          }

          return newFileTreeNode;
        }

        return null;
      })
      .filter((child) => !!child);

    if (
      currentFileTreeNode.children &&
      currentFileTreeNode.children.length > 0
    ) {
      currentFileTreeNode.children = currentFileTreeNode.children?.filter(
        (childFileTreeNode) => {
          const match = children.find((child) => {
            return child.path === childFileTreeNode.path;
          });
          if (match) {
            return false;
          }
          return true;
        }
      );
    }
    currentFileTreeNode.children = [
      ...children,
      ...(currentFileTreeNode.children ?? []),
    ];

    return { ...currentFileTreeNode };
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
        component={"video"}
        controls
        id={"page:video-gallery:video-player"}
        data-testid={"page:video-gallery:video-player"}
        sx={
          {
            // maxHeight: '25%'
          }
        }
      ></Box>
      <Box
        component={"div"}
        id={"page:video-gallery:in-game-footage-browser:container"}
        data-testid={"page:video-gallery:in-game-footage-browser:container"}
        sx={{
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <Box
          component={"div"}
          id={"page:video-gallery-in-game-footage-browser:banner"}
          data-testid={"page:video-gallery-in-game-footage-browser:banner"}
          sx={{
            backgroundColor: "black",
            paddingY: "0.2rem",
          }}
        >
          <Typography>In-game Footage</Typography>
        </Box>
        <Box
          component={"ul"}
          id={"page:video-gallery-in-game-footage-browser:file-browser"}
          data-testid={"page:video-gallery-in-game-footage-browser:file-browser"}
          sx={{
            display: "flex",
            flexDirection: "column",
            padding: "0",
            margin: "0",
            overflowY: "scroll",
          }}
        >
          {fileTree.children!.map((fileTreeNode, index) => (
            <Folder fileTreeNode={fileTreeNode} nodeKey={index}></Folder>
          ))}
        </Box>
      </Box>
    </Box>
  );
};
