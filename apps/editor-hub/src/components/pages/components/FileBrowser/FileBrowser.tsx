import { Box } from "@mui/material";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from "../../../../redux/store";
import { Folder } from './components/Folder'
import { Metadata } from "../../../../types/dropbox";
import { useEffect, useState } from "react";
import { fetchClickedFolderMetadata, fetchInitialMetadata, fetchRootFolders, resolveTreeStructure } from "./helpers";
import { setNewTree, setInitialFetchDone } from "../../../../redux/slices/FileTreeSlice";
import { selectFilteredFileTree } from "../../../../redux/selectors/FileTreeSelector";
import './FileBrowser.css'
import { setGenericTags } from "../../../../redux/slices/TagsSlice";
import { TagSystem } from "../../../../types/tags";
import axios from "axios";

const resourcesHost = import.meta.env.VITE_RESOURCES_HOST as string;

export const FileBrowser = () => {
  const dispatch = useDispatch();
  const { fileTree, initialFetchDone } = useSelector((state: RootState) => state.fileTree)
  const { settings: { fetchUpfront } } = useSelector((state: RootState) => state.videoGallery)
  const filteredFileTree = useSelector(selectFilteredFileTree)
  const { genericTags } = useSelector((state: RootState) => state.tags)

  const [foldersRendered, setFoldersRendered] = useState<boolean>(false);
  const [clipMetadataBatch, setClipMetadataBatch] = useState<Metadata[]>([]);


  useEffect(() => {
    const fetchTagSystem = async () => {
      const { data: { GenericTags } } = await axios.get<{ GenericTags: TagSystem }>(`${resourcesHost}/tag-system`)
      dispatch(setGenericTags(GenericTags))
    }
    fetchTagSystem()
  }, [])

  //This hook assembles the fileTree any time we fetch new metadata
  useEffect(() => {
    if (clipMetadataBatch.length === 0 || !genericTags) return;
    const builtRoot = resolveTreeStructure(fileTree, clipMetadataBatch, genericTags);
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
        dispatch(setInitialFetchDone());
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