import { Box } from "@mui/material";
import { Folder } from './components/Folder'
import { useEffect, useState } from "react";
import { fetchClickedFolderMetadata, fetchInitialMetadata, fetchRootFolders, resolveTreeStructure } from "../../util/fileBrowser.util";
import './FileBrowser.css'
import { FileTreeName, FileTreeNode } from "../../types/app";
import { Metadata } from "@editor-hub/dropbox-types"
import { TagSystem } from "@editor-hub/tag-system";


export const FileBrowser = ({
  fileTree,
  fetchUpFront,
  fileTreeName,
  rootPath,
  noFilter,
  genericTags,
  setNewFileTree,
  onSourceChange,
}: {
  fileTree: FileTreeNode
  fetchUpFront?: number
  fileTreeName: FileTreeName
  rootPath: string
  noFilter?: boolean
  genericTags?: TagSystem
  setNewFileTree: (newFileTree: FileTreeNode) => void
  onSourceChange: (fileTreeNode: FileTreeNode) => Promise<void>
}) => {
  const [foldersRendered, setFoldersRendered] = useState<boolean>(false);
  const [clipMetadataBatch, setClipMetadataBatch] = useState<Metadata[]>([]);

  //This hook assembles the fileTree any time we fetch new metadata
  useEffect(() => {
    if (clipMetadataBatch.length === 0 || !fileTree) return;
    const builtRoot = resolveTreeStructure(fileTree, clipMetadataBatch, fileTreeName, rootPath, noFilter, genericTags);
    setNewFileTree(builtRoot)
    setFoldersRendered(true);
  }, [clipMetadataBatch]);

  //This hook fetches patch(root) folders when the component is first rendered
  useEffect(() => {
    const initialFetchDone = fileTree.children && fileTree.children.length > 0 && fileTree.children[0].children && fileTree.children[0].children.length > 0

    if (initialFetchDone) return;

    fetchRootFolders(rootPath)
      .then(clipMetadataBatch => {
        setClipMetadataBatch(clipMetadataBatch);
      })
  }, []);

  //This hook fetches the initial metadata
  useEffect(() => {
    const rootFoldersRendered = !fileTree.children || fileTree.children.length == 0
    const initialFetchDone = fileTree.children && fileTree.children.length > 0 && fileTree.children[0].children && fileTree.children[0].children.length > 0
    if (rootFoldersRendered || initialFetchDone || !fileTree) return;
    fetchInitialMetadata(fileTree, fetchUpFront)
      .then(fetchedMetadata => {
        setClipMetadataBatch(fetchedMetadata);
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