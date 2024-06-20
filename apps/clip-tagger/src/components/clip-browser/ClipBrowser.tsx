import { useEffect, useRef, useState } from "react";
import "./ClipBrowser.css";
import axios from "axios";
import { FolderIcon } from "./components/folderIcon/FolderIcon";
import { FileIcon } from "./components/fileIcon/FileIcon";
import { PathNav } from "./components/pathNav/PathNav";
import { useFolderNavigation } from "../../context/FolderNavigationContext";
import { useClipViewer } from "../../context/ClipViewerContext";

const apiHost = import.meta.env.VITE_API_HOST;
const clipsRootPath = import.meta.env.VITE_CLIPS_ROOT_FOLDER as string;

if (!clipsRootPath || !apiHost) throw new Error("Missing envs");

export const ClipBrowser = ({ currentPath }: { currentPath?: string }) => {
  const [loadingContent, setLoadingContent] = useState<boolean>(true);
  const filesViewport = useRef<HTMLDivElement>(null);

  const {
    currentFolder,
    setCurrentFolder,
    currentFolderEntries,
    setCurrentFolderEntries,
    activeItem,
    setActiveItem,
    handleBackNavigation,
  } = useFolderNavigation();

  const { setTargetClip, setTemporaryLink } = useClipViewer();

  const getCurrentFolderEntries = async () => {
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
    } catch (e) {
      console.error(e);
    }
  };

  const focusPreviousItem = () => {
    if (activeItem !== null && activeItem > 0) {
      setActiveItem(activeItem - 1);
      return;
    }
    if (activeItem === null) {
      setActiveItem(currentFolderEntries.length - 1);
    }
  };

  const focusNextItem = () => {
    if (activeItem !== null && activeItem < currentFolderEntries.length - 1) {
      setActiveItem(activeItem + 1);
      return;
    }
    if (activeItem === null) {
      setActiveItem(0);
    }
  };

  useEffect(() => {
    if (filesViewport.current) {
      filesViewport.current.focus();
    }
    setActiveItem(0);
    setCurrentFolderEntries([]);
    setLoadingContent(true);
    getCurrentFolderEntries();
    setLoadingContent(false);

    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("path", currentFolder);
    window.history.replaceState(
      {},
      "",
      `${window.location.pathname}?${urlParams.toString()}`
    );
  }, [currentFolder]);

  return (
    <>
      <div className="container">
        <PathNav path={currentFolder}></PathNav>
        <div
          ref={filesViewport}
          className="filesViewport"
          tabIndex={0}
          onKeyDown={(event) => {
            const { key } = event;
            switch (key) {
              case "ArrowUp":
                focusPreviousItem();
                break;
              case "ArrowDown":
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
                } else if (
                  currentFolderEntries[activeItem][".tag"] === "file"
                ) {
                  //TODO: get temporary link
                }
            }
          }}
        >
          {!loadingContent &&
            currentFolderEntries.map((entry, index) => (
              <>
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
                    name={entry.name}
                    path={entry.path_lower}
                    id={entry.id}
                    key={index}
                    active={activeItem === index}
                    clickCallback={() => setActiveItem(index)}
                    openFileCallback={(temporaryLink: string) => {
                      setTemporaryLink(temporaryLink);
                    }}
                  ></FileIcon>
                )}
              </>
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

          {loadingContent && <div>Hola!</div>}
        </div>
      </div>
    </>
  );
};
