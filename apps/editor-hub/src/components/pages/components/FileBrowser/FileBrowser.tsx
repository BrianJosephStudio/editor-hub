import { Box } from "@mui/material";
import { Folder } from './components/Folder'
import { Metadata } from "../../../../types/dropbox";
import { useEffect, useState } from "react";
import { fetchClickedFolderMetadata, fetchInitialMetadata, fetchRootFolders, resolveTreeStructure } from "./helpers";
import './FileBrowser.css'
import { TagSystem } from "../../../../types/tags";
import { FileTreeNode } from "../../../../types/app";


export const FileBrowser = ({
  fileTree,
  filteredFileTree,
  initialFetchDone,
  fetchUpfront,
  genericTags,
  setNewFileTree,
  setInitialFetchDone,
}: {
  fileTree: FileTreeNode
  filteredFileTree: FileTreeNode
  initialFetchDone: boolean
  fetchUpfront: number
  genericTags?: TagSystem
  setNewFileTree: (newFileTree: FileTreeNode) => void
  setInitialFetchDone: () => void
}) => {
  const [foldersRendered, setFoldersRendered] = useState<boolean>(false);
  const [clipMetadataBatch, setClipMetadataBatch] = useState<Metadata[]>([]);

  //This hook assembles the fileTree any time we fetch new metadata
  useEffect(() => {
    if (clipMetadataBatch.length === 0 || !genericTags) return;
    const builtRoot = resolveTreeStructure(fileTree, clipMetadataBatch, genericTags);
    setNewFileTree(builtRoot)
    setFoldersRendered(true);
  }, [clipMetadataBatch]);

  //This hook fetches patch(root) folders when the component is first rendered
  useEffect(() => {
    if (initialFetchDone) return;

    fetchRootFolders()
      .then(clipMetadataBatch => {
        setClipMetadataBatch(clipMetadataBatch);
      })
  }, []);

  //This hook fetches the initial metadata
  useEffect(() => {
    if (!foldersRendered || initialFetchDone) return;
    fetchInitialMetadata(filteredFileTree, fetchUpfront)
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
    {filteredFileTree && filteredFileTree.children && filteredFileTree.children.map((fileTreeNode, index) => (
      <Folder
        fileTreeNode={fileTreeNode}
        nodeKey={index}
        isRootFolder={true}
        onClickCallback={async (setIsLoading) => {
          setIsLoading(true);
          const newMetadata = await fetchClickedFolderMetadata(filteredFileTree, fileTreeNode);
          setClipMetadataBatch(newMetadata ?? [])
          setIsLoading(false);
        }}
      ></Folder>
    ))}
  </Box>)
}