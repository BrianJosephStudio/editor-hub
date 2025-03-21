import { useEffect, useRef, useState } from "react";
import apiClient from "../../../../../../api/ApiClient";
import { useClipViewer } from "../../../../../../context/ClipViewerContext";
import axios from "axios";
import { useFolderNavigation } from "../../../../../../context/FolderNavigationContext";
import { Box, ListItem, Typography } from "@mui/material";
import { Style, Theaters } from "@mui/icons-material";
import { useTags } from "../../../../../../context/TagsContext";
import { UnlabeledTagReference } from "@editor-hub/tag-system";
import { Metadata } from "@editor-hub/dropbox-types";

export const FileIcon = ({
  entry,
  active,
  itemIndex,
  clickCallback,
}: {
  entry: Metadata
  active: boolean;
  itemIndex: number;
  clickCallback: () => void;
}) => {
  const { targetClip, setCurrentVideoSource, setNextVideoSource, setTargetClip } =
    useClipViewer();
  const {
    activeItem,
    setActiveItem,
    setDeleteClipModalOpen,
    setClipToDelete,
  } = useFolderNavigation();

  const folderElement = useRef<HTMLDivElement>(null);
  const [cachedFile, setCachedFile] = useState<string>("");
  const [localTemporaryLink, setLocalTemporaryLink] = useState<string>();

  const [tagCount, setTagCount] = useState<number>(0)
  const [tagCountColor, setTagCountColor] = useState<string>('red')

  const { labeledTagReference } = useTags()

  useEffect(() => {
    if (entry.property_groups && Array.isArray(entry.property_groups) && entry.property_groups[0] && entry.property_groups[0].fields && entry.property_groups![0].fields[0].value) {
      const tags = JSON.parse(entry.property_groups![0].fields[0].value) as UnlabeledTagReference

      let newTagCount: number = 0
      Object.values(tags).forEach(entry => newTagCount += (entry.length > 0 ? entry.length : 1))

      setTagCount(newTagCount)
    }
  }, [])

  useEffect(() => {
    if (targetClip !== entry.path_lower || Object.keys(labeledTagReference).length === 0) return;

    let newTagCount: number = 0
    Object.values(labeledTagReference).forEach(entry => newTagCount += (entry.length > 0 ? entry.length : 1))

    setTagCount(newTagCount)
  }, [labeledTagReference])

  useEffect(() => {
    if (tagCount === 0) return setTagCountColor('red');
    if (tagCount < 4) return setTagCountColor('yellow');
    if (tagCount >= 4) return setTagCountColor('green');
  }, [tagCount])

  useEffect(() => {
    if (active && folderElement.current) {
      folderElement.current.focus();
    }
  }, [active]);

  useEffect(() => {
    const fetchAndCacheVideo = async () => {
      try {
        const link = await apiClient.getTemporaryLink(entry.path_lower!);
        setLocalTemporaryLink(link);

        const { data: videoBlob } = await axios.get(link, {
          responseType: "blob",
        });
        const videoUrl = URL.createObjectURL(videoBlob);

        setCachedFile(videoUrl);
      } catch (e) {
        console.error(e);
      }
    };

    fetchAndCacheVideo();

    return () => {
      if (cachedFile) {
        URL.revokeObjectURL(cachedFile);
      }
    };
  }, []);

  useEffect(() => {
    if (activeItem === itemIndex)
      setNextVideoSource(cachedFile ? cachedFile : localTemporaryLink!);
  }, [activeItem, cachedFile, localTemporaryLink]);

  return (
    <ListItem
      id={entry.name}
      data-testid={'file-browser:file-item'}
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

      onDoubleClick={async (event) => {
        event.preventDefault();

        if (event.altKey) {
          return apiClient.createSharedLinkWithSettings(entry.path_lower!)
            .then(sharedLinkResponse => window.open(sharedLinkResponse.url))
        }
        if (event.ctrlKey) {
          setClipToDelete(entry)
          return setDeleteClipModalOpen(true)
        }
        setTargetClip(entry.path_lower!);
        setCurrentVideoSource(cachedFile ? cachedFile : localTemporaryLink!);
      }}

      onClick={clickCallback}

      onKeyDown={(event) => {
        if (event.key !== "Enter" || activeItem === null) return;
        event.stopPropagation()

        setTargetClip(entry.path_lower!);
        setNextVideoSource((currentNextVideoSource) => {
          console.log(currentNextVideoSource);
          setCurrentVideoSource(currentNextVideoSource);
          return currentNextVideoSource;
        });
      }}
    >
      <Theaters></Theaters>
      {entry.name}
      <Box sx={{
        display: 'flex',
        gap: '0.3rem',
        placeItems: 'center'
      }}>
        <Style sx={{
          fill: tagCountColor,
        }} />
        <Typography sx={{ fontSize: '0.8rem' }}>{tagCount}</Typography>
      </Box>
    </ListItem>
  );
};