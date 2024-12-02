import { createContext, useContext, useState, ReactNode } from "react";
import { FileTreeNode } from "../types/app";
import { Metadata } from "../types/dropbox";

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
      }}
    >
      {children}
    </VideoGalleryContext.Provider>
  );
};
