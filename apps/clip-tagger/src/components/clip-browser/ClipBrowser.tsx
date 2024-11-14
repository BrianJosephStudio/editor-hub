import { useEffect, useRef, useState } from "react";
import "./ClipBrowser.css";
import { FolderIcon } from "./components/folderIcon/FolderIcon";
import { FileIcon } from "./components/fileIcon/FileIcon";
import { PathNav } from "./components/pathNav/PathNav";
import { useFolderNavigation } from "../../context/FolderNavigationContext";
import { useClipViewer } from "../../context/ClipViewerContext";
import { useAppContext } from "../../context/AppContext";
import { useKeybind } from "../../context/KeyBindContext";
import { useTags } from "../../context/TagsContext";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { ApiClient } from "../../api/ApiClient";

const apiHost = import.meta.env.VITE_API_HOST;
const clipsRootPath = import.meta.env.VITE_CLIPS_ROOT_FOLDER as string;

if (!clipsRootPath || !apiHost) throw new Error("Missing envs");

export const ClipBrowser = () => {
  const { AppRoot } = useAppContext();
  const [loadingContent, setLoadingContent] = useState<boolean>(true);
  const filesViewport = useRef<HTMLDivElement>(null);
  const {
    clipBrowserModifier,
    setClipBrowserModifier,
    setBlockGroupLevelListeners,
  } = useKeybind();
  const { setTagReferenceMaster } = useTags();

  const {
    currentFolder,
    setCurrentFolder,
    currentFolderEntries,
    setCurrentFolderEntries,
    activeItem,
    setActiveItem,
    handleBackNavigation,
    setFolderEntryNames,
    pathSegments,
  } = useFolderNavigation();

  const {
    setCurrentVideoSource,
    nextVideoSource,
    setNextVideoSource,
    setTargetClip,
    videoPlayer,
  } = useClipViewer();

  const [clipLevel, setClipLevel] = useState<boolean>(false);
  const [isRenaming, setIsRenaming] = useState<boolean>(false);

  useEffect(() => {
    setClipLevel(pathSegments.length > 0);
  }, [pathSegments]);

  useEffect(() => {
    setActiveItem(0);
  }, [currentFolderEntries]);

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
    setIsRenaming(true);
    const wasJobSuccessful = await setFolderEntryNames(currentFolderEntries);
    if (!wasJobSuccessful) {
      setIsRenaming(false);
      window.location.reload();
      return;
    }
    setTargetClip("");
    setCurrentVideoSource("");
    setTagReferenceMaster({});
    const apiClient = new ApiClient();
    const newEntries = await apiClient.getCurrentFolderEntries(
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
      setClipLevel(false);
      const apiClient = new ApiClient();
      const currentEntries = await apiClient.getCurrentFolderEntries(
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
            setTargetClip(currentFolderEntries[activeItem].path_lower);
            console.log(nextVideoSource);
            // if (nextVideoSource) {
            //   setCurrentVideoSource(nextVideoSource);
            //   break;
            // }
            setNextVideoSource((currentNextVideoSource) => {
              console.log(currentNextVideoSource);
              setCurrentVideoSource(currentNextVideoSource);
              return currentNextVideoSource;
            });
          }
          break;
        case " ":
          videoPlayer.current?.paused
            ? videoPlayer.current?.play()
            : videoPlayer.current?.pause();
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
      <Box
        sx={{
          display: "grid",
          gridGap: "0.6rem",
          gridTemplateRows: "3rem auto",
          minWidth: "24rem",
          minHeight: "0",
        }}
      >
        <PathNav path={currentFolder}></PathNav>
        <Box ref={filesViewport} className="filesViewport">
          {clipLevel && !isRenaming && (
            <Button
              sx={{
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
            [0, 1, 3].map((_entry, index) => (
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
