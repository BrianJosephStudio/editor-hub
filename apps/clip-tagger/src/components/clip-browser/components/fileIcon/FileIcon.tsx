import "./FileIcon.css";
import videoFileIcon from "../../../../assets/videoIcon.svg";
import { useEffect, useRef, useState } from "react";
import { ApiClient } from "../../../../api/ApiClient";
import { useClipViewer } from "../../../../context/ClipViewerContext";
import axios from "axios";
import { useFolderNavigation } from "../../../../context/FolderNavigationContext";

export const FileIcon = ({
  name,
  path,
  id,
  active,
  itemIndex,
  clickCallback,
}: {
  name: string;
  path: string;
  id: number;
  active: boolean;
  itemIndex: number;
  clickCallback: () => void;
}) => {
  const { setCurrentVideoSource, setNextVideoSource, setTargetClip } = useClipViewer();
  const {
    activeItem,
  } = useFolderNavigation();


  const folderElement = useRef<HTMLDivElement>(null);
  const [cachedFile, setCachedFile] = useState<string>("");
  const [localTemporaryLink, setLocalTemporaryLink] = useState<string>();

  const apiClient = new ApiClient();

  useEffect(() => {
    if (active && folderElement.current) {
      folderElement.current.focus();
    }
  }, [active]);

  useEffect(() => {
    if (!folderElement.current) return;
    folderElement.current.blur();
  }, [id]);

  useEffect(() => {
    const fetchAndCacheVideo = async () => {
      try {
        const link = await apiClient.getTemporaryLink(path);
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

  useEffect(()=> {
    if(activeItem === itemIndex) setNextVideoSource(cachedFile ? cachedFile : localTemporaryLink!)
  }, [activeItem, cachedFile, localTemporaryLink])

  return (
    <div
      ref={folderElement}
      className={`folderContainer ${
        active ? "folderContainerActive" : "folderContainerInactive"
      }`}
      onDoubleClick={(event) => {
        event.preventDefault();
            setTargetClip(path)
            setCurrentVideoSource(cachedFile ? cachedFile : localTemporaryLink!);
      }}
      onClick={clickCallback}
    >
      <img
        style={{
          maxWidth: "2.6rem",
        }}
        src={videoFileIcon}
        alt=""
      />
      {name}
    </div>
  );
};
