import { useEffect, useRef } from "react";
import { ListItem } from "@mui/material";
import { useFolderNavigation } from "../../../../../../context/FolderNavigationContext";
import { Folder } from "@mui/icons-material";
import { Metadata } from "@editor-hub/dropbox-types";

const clipsRootPath = import.meta.env.VITE_CLIPS_ROOT_FOLDER as string;

export const FolderIcon = ({
  entry,
  active,
  itemIndex,
  clickCallback,
  openFolderCallback,
}: {
  entry: Metadata
  active: boolean;
  itemIndex: number;
  clickCallback: () => void;
  openFolderCallback: () => void;
}) => {
  const folderElement = useRef<HTMLDivElement>(null)
  const { setCurrentFolder, setActiveItem, lastItemName } = useFolderNavigation()

  useEffect(() => {
    if (
      folderElement.current &&
      (active  || entry.name.toLowerCase() === lastItemName.toLowerCase())
    ) { 
      folderElement.current.focus()
    }
  }, [active, lastItemName])

  return (
    <ListItem
      id={entry.name}
      key={itemIndex}
      tabIndex={itemIndex}
      component={'div'}
      ref={folderElement}
      sx={{
        display: 'grid',
        height: '3rem',
        width: '100%',
        margin: '0',
        textAlign: 'left',
        alignItems: 'center',
        gridTemplateColumns: '2rem auto auto',
        gridGap: '0.6rem',
        cursor: 'pointer',
        userSelect: 'none',
        backgroundColor: active ? 'hsl(0, 0%, 50%)' : '',
        outline: 'none',
        '&:hover': {
          backgroundColor: active ? '' : 'hsl(0, 0%, 40%)'
        }
      }}

      onFocus={() => setActiveItem(itemIndex)}

      onDoubleClick={(event) => {
        event.preventDefault();
        openFolderCallback();
      }}

      onClick={clickCallback}

      onKeyDown={(event) => {
        if (event.key !== "Enter") return;
        setCurrentFolder(
          entry.path_lower!.replace(
            clipsRootPath.toLowerCase(),
            ""
          )
        );
      }}
    >
      <Folder></Folder>
      {entry.name}
    </ListItem>
  );
};

export const FolderIconPlaceHolder = () => {

  return (
    <ListItem
      component={'div'}
      sx={{
        display: 'grid',
        height: '3rem',
        width: '100%',
        margin: '0',
        textAlign: 'left',
        alignItems: 'center',
        gridTemplateColumns: '2rem auto auto',
        gridGap: '0.6rem',
        cursor: 'pointer',
        userSelect: 'none',
        outline: 'none',
      }}
    >
      <Folder></Folder>
      ...
    </ListItem>
  );
}