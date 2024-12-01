import { createContext, useContext, useState, ReactNode } from "react";

interface VideoGalleryContextProps {
  activePage: number;
  setActivePage: (page: number) => void;
}

const VideoGalleryContext = createContext<VideoGalleryContextProps | undefined>(
  undefined
);

export const useVideoGallery = () => {
  const context = useContext(VideoGalleryContext);
  if (!context) {
    throw new Error("useVideoGallery must be used within a VideoGalleryProvider");
  }
  return context;
};

export const VideoGalleryProvider = ({ children }: { children: ReactNode }) => {
  const [activePage, setActivePage] = useState<number>(0);  // Default to 0

  return (
    <VideoGalleryContext.Provider
      value={{
        activePage,
        setActivePage,
      }}
    >
      {children}
    </VideoGalleryContext.Provider>
  );
};
