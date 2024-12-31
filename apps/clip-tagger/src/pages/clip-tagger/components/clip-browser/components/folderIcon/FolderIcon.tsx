import { useEffect, useRef } from "react";
import { ListItem } from "@mui/material";
import { useFolderNavigation } from "../../../../../../context/FolderNavigationContext";
import { Metadata } from "../../../../../../types/dropbox";
import { Folder } from "@mui/icons-material";

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
    if (active && folderElement.current) {
      folderElement.current.focus()
    }
  }, [active])

  useEffect(() => {
    if(entry.name.toLowerCase() !== lastItemName.toLowerCase() || !folderElement.current) return;

    folderElement.current.focus()
  },[lastItemName])

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
        if(event.key !== "Enter") return;
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