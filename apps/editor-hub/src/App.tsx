import "./App.css";
import { Box } from "@mui/material";
import { BrowserRouter, Navigate } from "react-router";
import { Routes, Route } from "react-router-dom"
import { NavBar } from "./components/nav-bar/NavBar";
import { VideoGallery } from "./pages/video-gallery/VideoGallery";
import { VideoGalleryProvider } from "./contexts/VideoGallery.context";
import { AudioGalleryProvider } from "./contexts/AudioGallery.context";
import { AudioGallery } from "./pages/audio-gallery/AudioGallery";
import { FileBrowserProvider } from "./contexts/FileBrowser.context";

function App() {
  return (
    <BrowserRouter basename="editor-hub">
      <Box
        component={"div"}
        id="editor-hub-container"
        data-testid={"editor-hub-container"}
        sx={{
          display: "flex",
          flexDirection: 'column',
          gridTemplateRows: " 3rem auto",
          height: "100vh",
          width: "100vw",
        }}
      >
        <NavBar></NavBar>
        <FileBrowserProvider>
          <Routes>
            <Route path="/" element={<Navigate to="/video-gallery" />} />

            <Route path="video-gallery" element={
              <VideoGalleryProvider>
                <VideoGallery></VideoGallery>
              </VideoGalleryProvider>
            }>
            </Route>
            <Route path="audio-gallery" element={
              <AudioGalleryProvider>
                <AudioGallery></AudioGallery>
              </AudioGalleryProvider>
            }>
            </Route>
          </Routes>
        </FileBrowserProvider>
      </Box>
    </BrowserRouter>
  );
}
export default App;
