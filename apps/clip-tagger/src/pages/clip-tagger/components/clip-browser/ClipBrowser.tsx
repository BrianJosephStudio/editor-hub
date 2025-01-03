import { useEffect, useRef, useState } from "react";
import "./ClipBrowser.css";
import { FolderIcon, FolderIconPlaceHolder } from "./components/folderIcon/FolderIcon";
import { FileIcon } from "./components/fileIcon/FileIcon";
import { PathNav } from "./components/pathNav/PathNav";
import { useFolderNavigation } from "../../../../context/FolderNavigationContext";
import { useClipViewer } from "../../../../context/ClipViewerContext";
import { useKeybind } from "../../../../context/KeyBindContext";
import { useTags } from "../../../../context/TagsContext";
import { Box, Button, CircularProgress, List, Typography } from "@mui/material";
import apiClient from "../../../../api/ApiClient";

const apiHost = import.meta.env.VITE_API_HOST;
const clipsRootPath = import.meta.env.VITE_CLIPS_ROOT_FOLDER as string;

if (!clipsRootPath || !apiHost) throw new Error("Missing envs");

export const ClipBrowser = () => {
  const [loadingContent, setLoadingContent] = useState<boolean>(true);
  const filesViewport = useRef<HTMLDivElement>(null);
  const {
    clipBrowserModifier,
  } = useKeybind();
  const { setLabeledTagReference } = useTags();

  const {
    BrowserList,
    currentFolder,
    setCurrentFolder,
    currentFolderEntries,
    setCurrentFolderEntries,
    activeItem,
    setActiveItem,
    setFolderEntryNames,
    pathSegments,
  } = useFolderNavigation();

  const {
    setCurrentVideoSource,
    setTargetClip,
  } = useClipViewer();

  const [clipLevel, setClipLevel] = useState<boolean>(false);
  const [isRenaming, setIsRenaming] = useState<boolean>(false);

  useEffect(() => {
    setClipLevel(pathSegments.length > 0);
  }, [pathSegments]);

  useEffect(() => {
    setActiveItem(0);
  }, [currentFolderEntries]);

  const scrollContainerIfNeeded = (index: number | null) => {
    if (!index) return;
    const container = filesViewport.current;
    if (!container) return;

    const selectedItem = container.children[index];
    if (!selectedItem) return;

    const containerRect = container.getBoundingClientRect();
    const itemRect = selectedItem.getBoundingClientRect();

    if (itemRect.top < containerRect.top) {
      container.scrollBy(0, itemRect.top - containerRect.top);
    } else if (itemRect.bottom > containerRect.bottom) {
      container.scrollBy(0, itemRect.bottom - containerRect.bottom);
    }
  };

  const autoRenameFolders = async () => {
    setIsRenaming(true);
    const wasJobSuccessful = await setFolderEntryNames(currentFolderEntries);
    if (!wasJobSuccessful) {
      setIsRenaming(false);
      window.location.reload();
      return;
    }
    setTargetClip("");
    setCurrentVideoSource("");
    setLabeledTagReference({});
    const newEntries = await apiClient.getFolderEntries(
      `${clipsRootPath}/${currentFolder}`
    );
    setCurrentFolderEntries(newEntries);
    setIsRenaming(false);
  };

  useEffect(() => {
    (async () => {
      setActiveItem(0);
      setCurrentFolderEntries([]);
      setLoadingContent(true);
      const currentEntries = await apiClient.getFolderEntries(
        `${clipsRootPath}/${currentFolder}`
      );
      setCurrentFolderEntries(currentEntries);
      setLoadingContent(false);

      const urlParams = new URLSearchParams(window.location.search);
      urlParams.set("path", currentFolder);
      window.history.replaceState(
        {},
        "",
        `${window.location.pathname}?${urlParams.toString()}`
      );
    })();
  }, [currentFolder]);

  useEffect(() => {
    scrollContainerIfNeeded(activeItem);
  }, [activeItem]);

  useEffect(
    () => console.log("change!", clipBrowserModifier),
    [clipBrowserModifier]
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: 'column',
        minWidth: "20rem",
        minHeight: 0,
      }}
    >
      <PathNav path={currentFolder}></PathNav>
      {clipLevel && !isRenaming && (
        <Button
          sx={{
            textJustify: 'center',
            height: "2rem",
          }}
          onClick={autoRenameFolders}
        >
          Auto-name clips
        </Button>
      )}
      {clipLevel && isRenaming && (
        <Box
          sx={{
            display: "flex",
            gap: "0.4rem",
            placeContent: "center",
            width: "100%",
            paddingY: "0.4rem",
          }}
        >
          <CircularProgress size={24}></CircularProgress>
          <Typography>Renaming...</Typography>
        </Box>
      )}
      <List
        ref={BrowserList}
        disablePadding
        sx={{
          overflowY: 'auto',
        }}
      >
        {!loadingContent &&
          currentFolderEntries.map((entry, index) => (
            <>
              {entry[".tag"] === "folder" && (
                <FolderIcon
                  entry={entry}
                  itemIndex={index}
                  active={activeItem === index}
                  clickCallback={() => setActiveItem(index)}
                  openFolderCallback={() => {
                    setCurrentFolder(
                      entry.path_lower!.replace(
                        clipsRootPath.toLowerCase(),
                        ""
                      )
                    );
                  }}
                ></FolderIcon>
              )}

              {entry[".tag"] === "file" && (
                <FileIcon
                  entry={entry}
                  itemIndex={index}
                  key={index}
                  active={activeItem === index}
                  clickCallback={() => setActiveItem(index)}
                ></FileIcon>
              )}
            </>
          ))}
      </List>

      {loadingContent &&
        [1, 2, 3].map((_entry, index) => (
          <FolderIconPlaceHolder />
        ))}
    </Box >
  );
};
