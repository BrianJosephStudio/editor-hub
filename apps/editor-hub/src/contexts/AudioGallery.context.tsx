import { createContext, useContext, useState, ReactNode, useRef } from "react";

interface AudioGalleryContextProps {
  audioPlayer: React.RefObject<HTMLAudioElement>;
  audioPlayerExpanded: boolean;
  setAudioPlayerExpanded: React.Dispatch<React.SetStateAction<boolean>>
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
  const audioPlayer = useRef<HTMLAudioElement>(null);
  const [audioPlayerExpanded, setAudioPlayerExpanded] = useState<boolean>(false)

  return (
    <AudioGalleryContext.Provider
      value={{
        audioPlayer,
        audioPlayerExpanded,
        setAudioPlayerExpanded,
      }}
    >
      {children}
    </AudioGalleryContext.Provider>
  );
};