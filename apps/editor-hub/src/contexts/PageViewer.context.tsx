import { createContext, useContext, useState, ReactNode } from "react";

interface PageViewerContextProps {
  activePage: number;
  setActivePage: (page: number) => void;
}

const PageViewerContext = createContext<PageViewerContextProps | undefined>(
  undefined
);

export const usePageViewer = () => {
  const context = useContext(PageViewerContext);
  if (!context) {
    throw new Error("usePageViewer must be used within a PageViewerProvider");
  }
  return context;
};

export const PageViewerProvider = ({ children }: { children: ReactNode }) => {
  const [activePage, setActivePage] = useState<number>(0);  // Default to 0

  return (
    <PageViewerContext.Provider
      value={{
        activePage,
        setActivePage,
      }}
    >
      {children}
    </PageViewerContext.Provider>
  );
};
