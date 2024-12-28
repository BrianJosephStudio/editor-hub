import { useEffect, useRef, useState } from "react";
import { ApiClient } from "../../../../../../api/ApiClient";
import { useClipViewer } from "../../../../../../context/ClipViewerContext";
import axios from "axios";
import { useFolderNavigation } from "../../../../../../context/FolderNavigationContext";
import { Box, Typography } from "@mui/material";
import { Style, Theaters } from "@mui/icons-material";
import { Metadata, PropertyGroup } from "../../../../../../types/dropbox";
import { TagReference } from "../../../../../../types/tags";

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
  const { setCurrentVideoSource, setNextVideoSource, setTargetClip } =
    useClipViewer();
  const { activeItem, setCurrentPropertyGroupSetter, setActiveItem } = useFolderNavigation();

  const folderElement = useRef<HTMLDivElement>(null);
  const [cachedFile, setCachedFile] = useState<string>("");
  const [localTemporaryLink, setLocalTemporaryLink] = useState<string>();

  const [propertyGroups, setPropertyGroups] = useState<PropertyGroup[] | undefined>(entry.property_groups)
  const [tagCount, setTagCount] = useState<number>(0)
  const [tagCountColor, setTagCountColor] = useState<string>('red')

  const apiClient = new ApiClient();

  useEffect(() => {
    try {
      if (entry.property_groups && Array.isArray(entry.property_groups) && entry.property_groups[0].fields && entry.property_groups![0].fields[0].value) {
        const tags = JSON.parse(entry.property_groups![0].fields[0].value) as TagReference[]
        const tagsLength = Object.entries(tags).length ?? 0
        setTagCount(tagsLength)
      }
    } catch { }
  }, [])

  useEffect(() => {
    if (tagCount === 0) return;
    if (tagCount < 4) {
      setTagCountColor('yellow')
    }
    if (tagCount >= 4) {
      setTagCountColor('green')
    }
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
    <Box
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
        setTargetClip(entry.path_lower!);
        setCurrentVideoSource(cachedFile ? cachedFile : localTemporaryLink!);
        setCurrentPropertyGroupSetter(setPropertyGroups)
      }}

      onClick={clickCallback}

      onKeyDown={(event) => {
        if(event.key !== "Enter" || activeItem === null) return;
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
    </Box>
  );
};
