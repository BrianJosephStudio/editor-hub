import "./App.css";
import { ClipBrowser } from "./components/clip-browser/ClipBrowser";
import { ClipViewer } from "./components/clip-viewer/ClipViewer";
import { FolderNavigationProvider } from "./context/FolderNavigationContext";
import { ClipViewerProvider } from "./context/ClipViewerContext";
import { Box } from "@mui/material";
function App() {
  const urlParams = new URLSearchParams(window.location.search);
  const currentPath = urlParams.get("path");

  return (
    <ClipViewerProvider>
      <FolderNavigationProvider currentPath={currentPath ?? ""}>
        <Box sx={{
          width: '100vw',
          height: '100vh',
          display: 'flex'
        }}>
          <ClipBrowser></ClipBrowser>
          <ClipViewer></ClipViewer>
        </Box>
      </FolderNavigationProvider>
    </ClipViewerProvider>
  );
}

export default App;
