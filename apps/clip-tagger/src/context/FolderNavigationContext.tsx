import { createContext, useContext, useState, ReactNode } from "react";
import { DropboxFile } from "../types/dropbox";
import { ApiClient } from "../api/ApiClient";

const fileNameRegex = /^\d+\.\d+_\w+_\w+_\d+\.\w+$/

class ParsedFileName {
  public isProperlyNamed: boolean = false;
  public path: string;
  public filePath: string;
  public trueFilePath: string;
  public name: string;
  public trueName: string;
  public patch: string;
  public agent: string;
  public map: string;
  public index: number;
  public extension: string

  constructor(filePath: string, currentFileIndex: number) {
    this.filePath = filePath;
    const path = filePath.split("/").filter((data) => data);

    this.name = path.pop()!;
    this.extension = this.name.split('.').pop()!;
    this.path = `/${path.join("/")}`;
    this.map = path.pop()!;
    this.agent = path.pop()!;
    this.patch = path.pop()!;

    const parsedFileName = this.name.split("_").filter((data) => data);
    const parsedIndex = parseInt(parsedFileName.pop()!.split(".")[0]!);
    
    this.isProperlyNamed = fileNameRegex.test(this.name)

    if (typeof parsedIndex != "number") {
      throw new Error();
    }

    console.log("properly named", this.isProperlyNamed);

    if (this.isProperlyNamed) {
      this.index = parsedIndex;
      this.trueName = this.name;
      this.trueFilePath = this.filePath;
    } else {
      this.index = currentFileIndex;
      this.trueName = `${this.patch}_${this.agent}_${this.map}_${this.index}.${this.extension}`;
      this.trueFilePath = `${this.path}/${this.trueName}`;
    }
  }

  public getrenameObject = () => {
    return { from_path: this.filePath, to_path: this.trueFilePath };
  };
}

interface FolderNavigationContextProps {
  currentFolder: string;
  setCurrentFolder: React.Dispatch<React.SetStateAction<string>>;
  currentFolderEntries: DropboxFile[];
  setCurrentFolderEntries: React.Dispatch<React.SetStateAction<DropboxFile[]>>;
  activeItem: number | null;
  setActiveItem: React.Dispatch<React.SetStateAction<number | null>>;
  pathSegments: string[];
  setPathSegments: React.Dispatch<React.SetStateAction<string[]>>;
  handleBackNavigation: (count: number) => void;
  getClipLevel: (currentEntries: DropboxFile[]) => Promise<boolean>;
  setFolderEntryNames: (folderEntries: DropboxFile[]) => Promise<boolean>;
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
    console.log(newSegments);

    const newPath = `/${newSegments.join("/")}`;

    setCurrentFolder(newPath);
  };

  const getClipLevel = async (currentEntries: any[]): Promise<boolean> => {
    return currentEntries.some((dropboxFile) => {
      return dropboxFile[".tag"] === "file";
    });
  };

  const setFolderEntryNames = async (folderEntries: DropboxFile[]) => {
    const currentIndexes = folderEntries.map((folderEntry) => {
      const parsedFileName = new ParsedFileName(folderEntry.path_lower, 0);

      if (parsedFileName.isProperlyNamed) {
        return parsedFileName.index;
      } else {
        return null;
      }
    }).filter((data) => data !== null);


    let newCurrentIndex = Math.max(-1, ...currentIndexes) +1;

    const renameObjects = folderEntries
      .map((folderEntry) => {
        const parsedFileName = new ParsedFileName(
          folderEntry.path_lower,
          newCurrentIndex 
        );

        if (parsedFileName.isProperlyNamed) {
          return false;
        }
        newCurrentIndex++
        return parsedFileName.getrenameObject();
      })
      .filter((data) => !!data);
    

    if(renameObjects.length === 0) return false
    const apiClient = new ApiClient();
    return await apiClient.setTrueNames(renameObjects);
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
