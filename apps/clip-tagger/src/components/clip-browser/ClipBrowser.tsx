import { useEffect, useRef, useState } from "react";
import "./ClipBrowser.css";
import axios from "axios";
import { FolderIcon } from "./components/folderIcon/FolderIcon";
import { FileIcon } from "./components/fileIcon/FileIcon";
import { PathNav } from "./components/pathNav/PathNav";
import { useFolderNavigation } from "../../context/FolderNavigationContext";
import { useClipViewer } from "../../context/ClipViewerContext";
import { useAppContext } from "../../context/AppContext";
import { useKeybind } from "../../context/KeyBindContext";
import { useTags } from "../../context/TagsContext";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { DropboxFile } from "../../types/dropbox";

const apiHost = import.meta.env.VITE_API_HOST;
const clipsRootPath = import.meta.env.VITE_CLIPS_ROOT_FOLDER as string;

if (!clipsRootPath || !apiHost) throw new Error("Missing envs");

export const ClipBrowser = ({ currentPath }: { currentPath?: string }) => {
  const { AppRoot } = useAppContext();
  const [loadingContent, setLoadingContent] = useState<boolean>(true);
  const filesViewport = useRef<HTMLDivElement>(null);
  const { clipBrowserModifier, setClipBrowserModifier, setBlockGroupLevelListeners } = useKeybind();
  const { setSelectedTagGroup } = useTags();

  const {
    currentFolder,
    setCurrentFolder,
    currentFolderEntries,
    setCurrentFolderEntries,
    activeItem,
    setActiveItem,
    handleBackNavigation,
    getClipLevel,
    setFolderEntryNames
  } = useFolderNavigation();

  const { setCurrentVideoSource, nextVideoSource, setTargetClip, videoPlayer } = useClipViewer();

  const [clipLevel, setClipLevel] = useState<boolean>(false)
  const [isRenaming, setIsRenaming ] = useState<boolean>(false)

  const getCurrentFolderEntries = async (): Promise<DropboxFile> => {
    try {
      const url = `${apiHost}/list_folder`;
      const headers = {
        "Content-Type": "application/json",
      };

      const currentFolderFullPath = `${clipsRootPath}${currentFolder}`;
      const body = {
        include_deleted: false,
        include_has_explicit_shared_members: false,
        include_media_info: false,
        include_mounted_folders: true,
        include_non_downloadable_files: true,
        path: currentFolderFullPath,
        recursive: false,
      };

      let entries: any[] = [];
      let hasMore = true;
      let cursor = null;

      while (hasMore) {
        //@ts-ignore
        const { data } = await axios.post(url, cursor ? { cursor } : body, {
          headers,
        });

        entries = [...entries, ...data.entries];
        hasMore = data.has_more;
        cursor = data.cursor;
      }

      setCurrentFolderEntries(entries);
      return entries
    } catch (e) {
      console.error(e);
    }
  };

  const focusPreviousItem = () => {
    if (activeItem !== null) {
      setActiveItem((activeItem) => {
        if (activeItem !== null) {
          return Math.max(activeItem - 1, 0);
        }
        return 0;
      });
      return;
    }
    if (activeItem === null) {
      setActiveItem(currentFolderEntries.length - 1);
    }
  };

  const focusNextItem = () => {
    if (activeItem !== null) {
      setActiveItem((activeItem) => {
        if (activeItem !== null) {
          return Math.min(activeItem + 1, currentFolderEntries.length - 1);
        }
        return 0;
      });
      return;
    }
    if (activeItem === null) {
      setActiveItem(0);
    }
  };

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
    setIsRenaming(true)
    const wasJobSuccessful = await setFolderEntryNames(currentFolderEntries)
    if(!wasJobSuccessful){
      setIsRenaming(false) 
      return
    }
    const newEntries = await getCurrentFolderEntries()
    setCurrentFolderEntries(newEntries)
    setIsRenaming(false)
  }

  useEffect(() => {
    (async () => {
      setActiveItem(0);
      setCurrentFolderEntries([]);
      setLoadingContent(true);
      setClipLevel(false)
      const currentEntries = await getCurrentFolderEntries();
      setLoadingContent(false);

      const isClipLevel = await getClipLevel(currentEntries)
      setClipLevel(isClipLevel)
  
      const urlParams = new URLSearchParams(window.location.search);
      urlParams.set("path", currentFolder);
      window.history.replaceState(
        {},
        "",
        `${window.location.pathname}?${urlParams.toString()}`
      );
    })()
  }, [currentFolder]);

  useEffect(() => {
    if (!AppRoot || !AppRoot.current) return;

    const eventHandler = (event: KeyboardEvent) => {
      const { key } = event;
      switch (key) {
        case "ArrowUp":
          event.preventDefault();
          focusPreviousItem();
          break;
        case "ArrowDown":
          event.preventDefault();
          focusNextItem();
          break;
        case "Backspace":
          handleBackNavigation(1);
          break;
        case "Enter":
          if (activeItem === null) break;
          if (currentFolderEntries[activeItem][".tag"] === "folder") {
            setCurrentFolder(
              currentFolderEntries[activeItem].path_lower.replace(
                clipsRootPath.toLowerCase(),
                ""
              )
            );
          } else if (currentFolderEntries[activeItem][".tag"] === "file") {
            setTargetClip(currentFolderEntries[activeItem].path_lower)
            setCurrentVideoSource(nextVideoSource);
          }
          break;
        case " ":
          videoPlayer.current?.paused ? videoPlayer.current?.play() : videoPlayer.current?.pause()
          break;
        case "Escape":
          // setSelectedTagGroup(null);
          setBlockGroupLevelListeners(false);
          break;
      }
    };
    AppRoot.current?.addEventListener("keydown", eventHandler);

    return () => AppRoot.current?.removeEventListener("keydown", eventHandler);
  }, [activeItem, currentFolderEntries]);

  useEffect(() => {
    const keyDownHandler = (event: KeyboardEvent) => {
      const { key } = event;
      if (key === "Alt") {
        event.preventDefault();
        setClipBrowserModifier(true);
      }
    };
    const keyUpHandler = (event: KeyboardEvent) => {
      const { key } = event;
      if (key === "Alt") {
        event.preventDefault();
        setClipBrowserModifier(false);
      }
    };
    AppRoot?.current?.addEventListener("keydown", keyDownHandler);
    AppRoot?.current?.addEventListener("keyup", keyUpHandler);
  }, []);

  useEffect(() => {
    const eventHandler = (event: KeyboardEvent) => {
      const { key } = event;
      if (key === "j") {
        focusNextItem();
      }
      if (key === "k") {
        focusPreviousItem();
      }
    };
    if (clipBrowserModifier) {
      AppRoot?.current?.addEventListener("keydown", eventHandler);
    }

    return () => AppRoot?.current?.removeEventListener("keydown", eventHandler);
  }, [clipBrowserModifier]);

  useEffect(() => {
    scrollContainerIfNeeded(activeItem);
  }, [activeItem]);

  useEffect(
    () => console.log("change!", clipBrowserModifier),
    [clipBrowserModifier]
  );

  return (
    <>
      <Box sx={{
        display: "grid",
        gridGap: "0.6rem",
        gridTemplateRows: "3rem auto",
        minWidth: "24rem",
        minHeight: "0",
      }}>
        <PathNav path={currentFolder}></PathNav>
        <Box ref={filesViewport} className="filesViewport">
        {(clipLevel && !isRenaming) &&
          <Button
          sx={{
            height: '2rem'
          }}
          onClick={autoRenameFolders}
          >
            Auto-name clips
          </Button>
        }
        {(clipLevel && isRenaming) &&
          <Box sx={{
            display: 'flex',
            gap: '0.4rem',
            placeContent: 'center',
            width: '100%',
            paddingY: '0.4rem'
          }}>
            <CircularProgress size={24}></CircularProgress>
            <Typography>
              Renaming...
            </Typography>
          </Box>}
        {!loadingContent &&
          currentFolderEntries.map((entry, index) => (
            <div key={index}>
              {entry[".tag"] === "folder" && (
                <FolderIcon
                  name={entry.name}
                  path={entry.path_lower}
                  id={entry.id}
                  key={index}
                  active={activeItem === index}
                  clickCallback={() => setActiveItem(index)}
                  openFolderCallback={() => {
                    setCurrentFolder(
                      entry.path_lower.replace(
                        clipsRootPath.toLowerCase(),
                        ""
                      )
                    );
                  }}
                ></FolderIcon>
              )}

              {entry[".tag"] === "file" && (
                <FileIcon
                  itemIndex={index}
                  name={entry.name}
                  path={entry.path_lower}
                  id={entry.id}
                  key={index}
                  active={activeItem === index}
                  clickCallback={() => setActiveItem(index)}
                ></FileIcon>
              )}
            </div>
          ))}

          {loadingContent &&
            [0, 1, 3].map((entry, index) => (
              <FolderIcon
                name={"..."}
                path={""}
                id={0}
                key={index}
                active={false}
                clickCallback={() => {}}
                openFolderCallback={() => {}}
              ></FolderIcon>
            ))}
        </Box>
      </Box>
    </>
  );
};
