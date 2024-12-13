import { createContext, useContext, useState, ReactNode, useRef } from "react";

interface VideoGalleryContextProps {
  videoPlayer: React.RefObject<HTMLVideoElement>;
  tabIndex: number;
  setTabIndex: React.Dispatch<React.SetStateAction<number>>
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

  return (
    <VideoGalleryContext.Provider
      value={{
        videoPlayer,
        tabIndex,
        setTabIndex
      }}
    >
      {children}
    </VideoGalleryContext.Provider>
  );
};