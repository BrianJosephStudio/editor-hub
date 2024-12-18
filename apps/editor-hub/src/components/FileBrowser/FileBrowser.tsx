import { Box } from "@mui/material";
import { Folder } from './components/Folder'
import { Metadata } from "../../types/dropbox";
import { useEffect, useState } from "react";
import { fetchClickedFolderMetadata, fetchInitialMetadata, fetchRootFolders, resolveTreeStructure } from "../../util/fileBrowser.util";
import './FileBrowser.css'
import { TagSystem } from "../../types/tags";
import { FileTreeNode } from "../../types/app";


export const FileBrowser = ({
  fileTree,
  initialFetchDone,
  fetchUpFront,
  rootPath,
  genericTags,
  setNewFileTree,
  setInitialFetchDone,
  onSourceChange,
}: {
  fileTree: FileTreeNode
  initialFetchDone: boolean
  fetchUpFront?: number
  rootPath: string
  genericTags?: TagSystem
  setNewFileTree: (newFileTree: FileTreeNode) => void
  setInitialFetchDone: () => void
  onSourceChange: (fileTreeNode: FileTreeNode) => Promise<void>
}) => {
  const [foldersRendered, setFoldersRendered] = useState<boolean>(false);
  const [clipMetadataBatch, setClipMetadataBatch] = useState<Metadata[]>([]);

  //This hook assembles the fileTree any time we fetch new metadata
  useEffect(() => {
    if (clipMetadataBatch.length === 0 || !genericTags || !fileTree) return;
    const builtRoot = resolveTreeStructure( fileTree, clipMetadataBatch, rootPath, genericTags);
    setNewFileTree(builtRoot)
    setFoldersRendered(true);
  }, [clipMetadataBatch]);

  //This hook fetches patch(root) folders when the component is first rendered
  useEffect(() => {
    if (initialFetchDone) return;

    fetchRootFolders(rootPath)
      .then(clipMetadataBatch => {
        setClipMetadataBatch(clipMetadataBatch);
      })
  }, []);

  //This hook fetches the initial metadata
  useEffect(() => {
    if (!foldersRendered || initialFetchDone || !fileTree) return;
    fetchInitialMetadata(fileTree, fetchUpFront)
      .then(fetchedMetadata => {
        setClipMetadataBatch(fetchedMetadata);
        setInitialFetchDone();
      })
  }, [foldersRendered]);

  return (<Box
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
      overflowY: "scroll"
    }}
    className="scroll-bar"
  >
    {fileTree && fileTree.children && fileTree.children.map((fileTreeNode, index) => (
      <Folder
        fileTreeNode={fileTreeNode}
        nodeKey={index}
        isRootFolder={true}
        fetchUpFront={fetchUpFront}
        onClickCallback={async (setIsLoading) => {
          setIsLoading(true);
          const newMetadata = await fetchClickedFolderMetadata(fileTree, fileTreeNode);
          setClipMetadataBatch(newMetadata ?? [])
          setIsLoading(false);
        }}
        onSourceChange={onSourceChange}
      ></Folder>
    ))}
  </Box>)
}