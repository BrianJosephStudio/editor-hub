import { createContext, useContext, useState, ReactNode } from "react";
import { FileTreeNode } from "../types/app";
import { Metadata } from "../types/dropbox";

const clipsRootPath = import.meta.env.VITE_CLIPS_ROOT_FOLDER as string;

interface VideoGalleryContextProps {
  fileTree: FileTreeNode;
  setFileTree: React.Dispatch<React.SetStateAction<FileTreeNode>>;
  fetchUpfront: number;
  setFetchUpfront: React.Dispatch<React.SetStateAction<number>>;
  foldersRendered: boolean;
  setFoldersRendered: React.Dispatch<React.SetStateAction<boolean>>;
  initialFetchDone: boolean;
  setinitialFetchDone: React.Dispatch<React.SetStateAction<boolean>>;
  clipMetadataBatch: Metadata[];
  setClipMetadataBatch: React.Dispatch<React.SetStateAction<Metadata[]>>;
  resolveTreeStructure: (currentFileTreeNode: FileTreeNode, newMetadata: Metadata[]) => FileTreeNode;
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

    if(!currentFileTreeNode.children || currentFileTreeNode.children.length === 0){
      currentFileTreeNode.children = [
        ...children,
        ...(currentFileTreeNode.children ?? []),
      ]
    }else{
      children.forEach((child) => {
        const matchingFileTreeNodeIndex = currentFileTreeNode.children!.findIndex((childFileTreeNode) => childFileTreeNode.path === child.path)
        if(matchingFileTreeNodeIndex === -1) return
        currentFileTreeNode.children!.splice(matchingFileTreeNodeIndex, 1, child)
      })
    }

    return { ...currentFileTreeNode };
  };

  const getMetadataPath = (path: string) => {
    return path.replace(clipsRootPath.toLowerCase(), "");
  };

  return (
    <VideoGalleryContext.Provider
      value={{
        fileTree,
        setFileTree,
        initialFetchDone,
        setinitialFetchDone,
        fetchUpfront,
        setFetchUpfront,
        foldersRendered,
        setFoldersRendered,
        clipMetadataBatch,
        setClipMetadataBatch,
        resolveTreeStructure,
      }}
    >
      {children}
    </VideoGalleryContext.Provider>
  );
};
