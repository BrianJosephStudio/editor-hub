import { createContext, useContext, useState, ReactNode, useRef } from "react";

interface VideoGalleryContextProps {
  videoPlayer: React.RefObject<HTMLVideoElement>;
  tabIndex: number;
  setTabIndex: React.Dispatch<React.SetStateAction<number>>
  videoPlayerExpanded: boolean;
  setVideoPlayerExpanded: React.Dispatch<React.SetStateAction<boolean>>
}

const VideoGalleryContext = createContext<VideoGalleryContextProps | undefined>(
  undefined
);

export const useVideoGallery = () => {
  const context = useContext(VideoGalleryContext);
  if (!context) {
    throw new Error(
      "useVideoGallery must be used within a VideoGalleryProvider"
    );
  }
  return context;
};

export const VideoGalleryProvider = ({ children }: { children: ReactNode }) => {
  const videoPlayer = useRef<HTMLVideoElement>(null);
  const [tabIndex, setTabIndex] = useState<number>(0)
  const [videoPlayerExpanded, setVideoPlayerExpanded] = useState<boolean>(false)

  return (
    <VideoGalleryContext.Provider
      value={{
        videoPlayer,
        tabIndex,
        setTabIndex,
        videoPlayerExpanded,
        setVideoPlayerExpanded,
      }}
    >
      {children}
    </VideoGalleryContext.Provider>
  );
};