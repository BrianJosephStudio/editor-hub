import { createContext, useContext, useState, ReactNode, useRef } from "react";

interface AudioGalleryContextProps {
  videoPlayer: React.RefObject<HTMLVideoElement>;
  videoPlayerExpanded: boolean;
  setVideoPlayerExpanded: React.Dispatch<React.SetStateAction<boolean>>
}

const AudioGalleryContext = createContext<AudioGalleryContextProps | undefined>(
  undefined
);

export const useAudioGallery = () => {
  const context = useContext(AudioGalleryContext);
  if (!context) {
    throw new Error(
      "useAudioGallery must be used within a AudioGalleryProvider"
    );
  }
  return context;
};

export const AudioGalleryProvider = ({ children }: { children: ReactNode }) => {
  const videoPlayer = useRef<HTMLVideoElement>(null);
  const [videoPlayerExpanded, setVideoPlayerExpanded] = useState<boolean>(false)

  return (
    <AudioGalleryContext.Provider
      value={{
        videoPlayer,
        videoPlayerExpanded,
        setVideoPlayerExpanded,
      }}
    >
      {children}
    </AudioGalleryContext.Provider>
  );
};