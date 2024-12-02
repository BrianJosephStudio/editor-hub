import { createContext, useContext, useState, ReactNode, useRef } from "react";
import { FileTreeNode } from "../types/app";
import { Metadata } from "../types/dropbox";
import { ApiClient } from "../api/ApiClient";

const clipsRootPath = import.meta.env.VITE_CLIPS_ROOT_FOLDER as string;

interface VideoGalleryContextProps {
  videoPlayer: React.RefObject<HTMLVideoElement>;
  currentVideoSource: FileTreeNode | null;
  setCurrentVideoSource: React.Dispatch<
    React.SetStateAction<FileTreeNode | null>
  >;
  fileTree: FileTreeNode;
  setFileTree: React.Dispatch<React.SetStateAction<FileTreeNode>>;
  currentTabIndex: number;
  setCurrentTabIndex: React.Dispatch<React.SetStateAction<number>>;
  fetchUpfront: number;
  setFetchUpfront: React.Dispatch<React.SetStateAction<number>>;
  foldersRendered: boolean;
  setFoldersRendered: React.Dispatch<React.SetStateAction<boolean>>;
  initialFetchDone: boolean;
  setinitialFetchDone: React.Dispatch<React.SetStateAction<boolean>>;
  clipMetadataBatch: Metadata[];
  setClipMetadataBatch: React.Dispatch<React.SetStateAction<Metadata[]>>;
  resolveTreeStructure: (
    currentFileTreeNode: FileTreeNode,
    newMetadata: Metadata[]
  ) => FileTreeNode;
  playVideo: (
    fileTreeNode: FileTreeNode,
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
  ) => void;
}

const VideoGalleryContext = createContext<VideoGalleryContextProps | undefined>(
  undefined
);

export const useVideoGallery = () => {
  const context = useContext(VideoGalleryContext);
  if (!context) {
    throw new Error(
      "useVideoGallery must be used within a VideoGalleryProvider"
    );
  }
  return context;
};

export const VideoGalleryProvider = ({ children }: { children: ReactNode }) => {
  const [fileTree, setFileTree] = useState<FileTreeNode>({
    name: "root",
    tag: "folder",
    path: "/",
    children: [],
  });

  const videoPlayer = useRef<HTMLVideoElement>(null);
  const [currentVideoSource, setCurrentVideoSource] =
    useState<FileTreeNode | null>(null);

  const [currentTabIndex, setCurrentTabIndex] = useState<number>(5);
  const [fetchUpfront, setFetchUpfront] = useState<number>(5);
  const [initialFetchDone, setinitialFetchDone] = useState<boolean>(false);
  const [foldersRendered, setFoldersRendered] = useState<boolean>(false);
  const [clipMetadataBatch, setClipMetadataBatch] = useState<Metadata[]>([]);

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
      !currentFileTreeNode.children ||
      currentFileTreeNode.children.length === 0
    ) {
      currentFileTreeNode.children = [
        ...children,
        ...(currentFileTreeNode.children ?? []),
      ];
    } else {
      children.forEach((child) => {
        const matchingFileTreeNodeIndex =
          currentFileTreeNode.children!.findIndex(
            (childFileTreeNode) => childFileTreeNode.path === child.path
          );
        if (matchingFileTreeNodeIndex === -1) return;
        currentFileTreeNode.children!.splice(
          matchingFileTreeNodeIndex,
          1,
          child
        );
      });
    }

    return { ...currentFileTreeNode };
  };

  const getMetadataPath = (path: string) => {
    return path.replace(clipsRootPath.toLowerCase(), "");
  };

  const playVideo = async (
    fileTreeNode: FileTreeNode,
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    setIsLoading(true);
    if (videoPlayer.current && videoPlayer.current.src) {
      videoPlayer.current.src = "";
    }
    if (!fileTreeNode.temporary_link) {
      const apiClient = new ApiClient();
      const temporary_link = await apiClient.getTemporaryLink(
        fileTreeNode.metadata.path_lower
      );
      fileTreeNode.temporary_link = temporary_link;
    }
    setCurrentVideoSource({ ...fileTreeNode });
    setIsLoading(false);
  };

  return (
    <VideoGalleryContext.Provider
      value={{
        videoPlayer,
        currentVideoSource,
        setCurrentVideoSource,
        fileTree,
        setFileTree,
        initialFetchDone,
        setinitialFetchDone,
        currentTabIndex,
        setCurrentTabIndex,
        fetchUpfront,
        setFetchUpfront,
        foldersRendered,
        setFoldersRendered,
        clipMetadataBatch,
        setClipMetadataBatch,
        resolveTreeStructure,
        playVideo,
      }}
    >
      {children}
    </VideoGalleryContext.Provider>
  );
};
