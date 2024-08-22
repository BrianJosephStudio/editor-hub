import {
    createContext,
    useContext,
    useState,
    ReactNode,
    useRef,
  } from "react";
  
  interface ClipViewerContextProps {
    targetClip: string;
    setTargetClip: (path: string) => void;
    nextVideoSource: string;
    setNextVideoSource: (path: string) => void;
    currentVideoSource: string;
    setCurrentVideoSource: (path: string) => void;
    videoPlayer: React.RefObject<HTMLVideoElement>
  }
  
  const ClipViewerContext = createContext<
    ClipViewerContextProps | undefined
  >(undefined);
  
  export const useClipViewer = () => {
    const context = useContext(ClipViewerContext);
    if (!context) {
      throw new Error(
        "useClipViewer must be used within a ClipViewerProvider"
      );
    }
    return context;
  };
  
  export const ClipViewerProvider = ({
    children,
  }: {
    children: ReactNode;
  }) => {
  const [targetClip, setTargetClip] = useState<string>("");
  const [currentVideoSource, setCurrentVideoSource] = useState<string>("");
  const [nextVideoSource, setNextVideoSource] = useState<string>("");
  const videoPlayer = useRef<HTMLVideoElement>(null)
  
    return (
      <ClipViewerContext.Provider
        value={{
          targetClip,
          setTargetClip,
          currentVideoSource,
          setCurrentVideoSource,
          nextVideoSource,
          setNextVideoSource,
          videoPlayer
        }}
      >
        {children}
      </ClipViewerContext.Provider>
    );
  };
  