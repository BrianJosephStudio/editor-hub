import { createContext, useContext, useState, ReactNode } from "react";
import { Metadata } from "../types/dropbox";
import { ApiClient } from "../api/ApiClient";
import { ParsedFileName } from "../util/dropboxFileParsing";

interface FolderNavigationContextProps {
  currentFolder: string;
  setCurrentFolder: React.Dispatch<React.SetStateAction<string>>;
  currentFolderEntries: Metadata[];
  setCurrentFolderEntries: React.Dispatch<React.SetStateAction<Metadata[]>>;
  activeItem: number | null;
  setActiveItem: React.Dispatch<React.SetStateAction<number | null>>;
  pathSegments: string[];
  setPathSegments: React.Dispatch<React.SetStateAction<string[]>>;
  handleBackNavigation: (count: number) => void;
  getClipLevel: (currentEntries: Metadata[]) => Promise<boolean>;
  setFolderEntryNames: (folderEntries: Metadata[]) => Promise<boolean>;
}

const FolderNavigationContext = createContext<
  FolderNavigationContextProps | undefined
>(undefined);

export const useFolderNavigation = () => {
  const context = useContext(FolderNavigationContext);
  if (!context) {
    throw new Error(
      "useFolderNavigation must be used within a FolderNavigationProvider"
    );
  }
  return context;
};

export const FolderNavigationProvider = ({
  currentPath,
  children,
}: {
  currentPath: string;
  children?: ReactNode;
}) => {
  const [currentFolder, setCurrentFolder] = useState<string>(currentPath ?? "/");
  const [currentFolderEntries, setCurrentFolderEntries] = useState<any[]>([]);
  const [activeItem, setActiveItem] = useState<number | null>(null);

  const [pathSegments, setPathSegments] = useState<string[]>([]);

  const handleBackNavigation = (count: number) => {
    if (pathSegments.length < 1) return;

    const start = pathSegments.length - count;

    const newSegments = pathSegments;

    newSegments.splice(start, 10);

    const newPath = `/${newSegments.join("/")}`;

    setCurrentFolder(newPath);
  };

  const getClipLevel = async (currentEntries: any[]): Promise<boolean> => {
    return currentEntries.some((dropboxFile) => {
      return dropboxFile[".tag"] === "file";
    });
  };

  const setFolderEntryNames = async (folderEntries: Metadata[]): Promise<boolean> => {
    const currentIndexes = folderEntries.map((folderEntry) => {
      const parsedFileName = new ParsedFileName(folderEntry.path_lower!, 0);

      if (parsedFileName.isProperlyNamed) {
        return parsedFileName.index;
      } else {
        return null;
      }
    }).filter((data) => data !== null);


    //@ts-ignore
    let newCurrentIndex = Math.max(-1, ...currentIndexes) + 1;

    const dropboxFiles = folderEntries.filter((folderEntry) => folderEntry[".tag"] === 'file')
    const dropboxFolders = folderEntries.filter((folderEntry) => folderEntry[".tag"] === 'folder')

    const renameObjects = dropboxFiles
      .map((folderEntry) => {
        const parsedFileName = new ParsedFileName(
          folderEntry.path_lower!,
          newCurrentIndex 
        );

        if (parsedFileName.isProperlyNamed) {
          return false;
        }
        newCurrentIndex++
        return parsedFileName.getrenameObject();
      })
      .filter((data) => !!data);
    
    const apiClient = new ApiClient();

    //@ts-ignore
    const fileRenameSuccess = await apiClient.setTrueNames(renameObjects);

    const folderPromises = dropboxFolders.map(async (dropboxFolder) =>{
      const subFolderEntries = await apiClient.getCurrentFolderEntries(dropboxFolder.path_lower!)
      return await setFolderEntryNames(subFolderEntries)
    })

    const folderRenameSuccess = await Promise.all(folderPromises)

    return fileRenameSuccess && folderRenameSuccess.some(success => !!success)
  };

  return (
    <FolderNavigationContext.Provider
      value={{
        currentFolder,
        setCurrentFolder,
        currentFolderEntries,
        setCurrentFolderEntries,
        activeItem,
        setActiveItem,
        handleBackNavigation,
        pathSegments,
        setPathSegments,
        getClipLevel,
        setFolderEntryNames,
      }}
    >
      {children}
    </FolderNavigationContext.Provider>
  );
};
