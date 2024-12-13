import { Box } from "@mui/material";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from "../../../../redux/store";
import { Folder } from './components/Folder'
import { Metadata } from "../../../../types/dropbox";
import { useEffect, useState } from "react";
import { fetchClickedFolderMetadata, fetchInitialMetadata, fetchRootFolders, resolveTreeStructure } from "./helpers";
import { setNewTree } from "../../../../redux/slices/FileTreeSlice";
import { selectFilteredFileTree } from "../../../../redux/selectors/FileTreeSelector";
import './FileBrowser.css'

export const FileBrowser = () => {
  const dispatch = useDispatch();
  const { fileTree } = useSelector((state: RootState) => state.fileTree)
  const { settings: { fetchUpfront } } = useSelector((state: RootState) => state.videoGallery)
  const [initialFetchDone, setinitialFetchDone] = useState<boolean>(false);
  const [foldersRendered, setFoldersRendered] = useState<boolean>(false);
  const filteredFileTree = useSelector(selectFilteredFileTree)

  const [clipMetadataBatch, setClipMetadataBatch] = useState<Metadata[]>([]);

  //This hook assembles the fileTree any time we fetch new metadata
  useEffect(() => {
    if (clipMetadataBatch.length === 0) return;
    const builtRoot = resolveTreeStructure(fileTree, clipMetadataBatch);
    dispatch(setNewTree(builtRoot))
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
        setinitialFetchDone(true);
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