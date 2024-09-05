import "./App.css";
import { ClipBrowser } from "./components/clip-browser/ClipBrowser";
import { ClipViewer } from "./components/clip-viewer/ClipViewer";
import { FolderNavigationProvider } from "./context/FolderNavigationContext";
import { ClipViewerProvider } from "./context/ClipViewerContext";
import { TagsProvider } from "./context/TagsContext";
import { AppContext } from "./context/AppContext";
import { Box } from "@mui/material";
import { TagsManager } from "./components/tags-manager/TagsManager";
import { useRef } from "react";
import { KeybindProvider } from "./context/KeyBindContext";

function App() {
  const urlParams = new URLSearchParams(window.location.search);
  const currentPath = urlParams.get("path");
  const AppRoot = useRef<HTMLDivElement>(null);

  return (
    <AppContext.Provider value={{ AppRoot }}>
      <KeybindProvider>
        <TagsProvider>
          <ClipViewerProvider>
            <FolderNavigationProvider currentPath={currentPath ?? ""}>
              <Box
                component={'div'}
                  ref={AppRoot}
                  tabIndex={0}
                  sx={{
                    margin: "0",
                    padding: "0",
                    display: "grid",
                    gridTemplateColumns: "2fr 8fr",
                    width: "100vw",
                    height: "100vh",
                    outline: 'none'
                  }}
              >
                <ClipBrowser></ClipBrowser>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateRows: "6fr 3fr",
                    minHeight: "0",
                    minWidth: '0',
                  }}
                >
                  <ClipViewer></ClipViewer>
                  <TagsManager></TagsManager>
                </Box>
              </Box>
            </FolderNavigationProvider>
          </ClipViewerProvider>
        </TagsProvider>
      </KeybindProvider>
    </AppContext.Provider>
  );
}

export default App;
