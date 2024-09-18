import { createContext, useContext, useState, ReactNode, useRef } from "react";
import Cookies from 'js-cookie'

interface ClipViewerContextProps {
  targetClip: string;
  setTargetClip: (path: string) => void;
  nextVideoSource: string;
  setNextVideoSource: (path: string) => void;
  currentVideoSource: string;
  setCurrentVideoSource: (path: string) => void;
  videoPlayer: React.RefObject<HTMLVideoElement>;
  pauseOnInput: boolean;
  setPauseOnInput: React.Dispatch<React.SetStateAction<boolean>>;
}

const ClipViewerContext = createContext<ClipViewerContextProps | undefined>(
  undefined
);

export const useClipViewer = () => {
  const context = useContext(ClipViewerContext);
  if (!context) {
    throw new Error("useClipViewer must be used within a ClipViewerProvider");
  }
  return context;
};

export const ClipViewerProvider = ({ children }: { children: ReactNode }) => {
  const [targetClip, setTargetClip] = useState<string>("");
  const [currentVideoSource, setCurrentVideoSource] = useState<string>("");
  const [nextVideoSource, setNextVideoSource] = useState<string>("");
  const [pauseOnInput, setPauseOnInput] = useState<boolean>(() => {
    const pauseOnInputCookie = Cookies.get("pauseOnInput")
    const pauseOnInputValue = pauseOnInputCookie === 'true'
    return pauseOnInputValue
  });
  const videoPlayer = useRef<HTMLVideoElement>(null);

  return (
    <ClipViewerContext.Provider
      value={{
        targetClip,
        setTargetClip,
        currentVideoSource,
        setCurrentVideoSource,
        nextVideoSource,
        setNextVideoSource,
        videoPlayer,
        pauseOnInput,
        setPauseOnInput,
      }}
    >
      {children}
    </ClipViewerContext.Provider>
  );
};
