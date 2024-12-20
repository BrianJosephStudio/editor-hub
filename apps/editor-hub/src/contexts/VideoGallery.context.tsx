import { createContext, useContext, useState, ReactNode, useRef } from "react";

interface VideoGalleryContextProps {
  videoPlayer: React.RefObject<HTMLVideoElement>;
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
  const [videoPlayerExpanded, setVideoPlayerExpanded] = useState<boolean>(false)

  return (
    <VideoGalleryContext.Provider
      value={{
        videoPlayer,
        videoPlayerExpanded,
        setVideoPlayerExpanded,
      }}
    >
      {children}
    </VideoGalleryContext.Provider>
  );
};