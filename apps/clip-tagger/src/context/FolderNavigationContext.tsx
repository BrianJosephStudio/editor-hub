import {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";

interface FolderNavigationContextProps {
  currentFolder: string;
  setCurrentFolder: React.Dispatch<React.SetStateAction<string>>;
  currentFolderEntries: any[];
  setCurrentFolderEntries: React.Dispatch<React.SetStateAction<any[]>>;
  activeItem: number | null;
  setActiveItem: React.Dispatch<React.SetStateAction<number | null>>;
  pathSegments: string[];
  setPathSegments: React.Dispatch<React.SetStateAction<string[]>>;
  handleBackNavigation: (count: number) => void;
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
  currentPath: string
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
      }}
    >
      {children}
    </FolderNavigationContext.Provider>
  );
};
