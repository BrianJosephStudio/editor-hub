import "./App.css";
import { Box, Typography } from "@mui/material";
import { BrowserRouter, Navigate } from "react-router";
import { Routes, Route } from "react-router-dom"
import { NavBar } from "./components/nav-bar/NavBar";
import { VideoGallery } from "./components/pages/VideoGallery";
import { VideoGalleryProvider } from "./contexts/VideoGallery.context";

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
        <Routes>
          <Route path="/" element={<Navigate to="/video-gallery" />} />
          <Route path="video-gallery" element={
            <VideoGalleryProvider>
              <VideoGallery></VideoGallery>
            </VideoGalleryProvider>
          }>

          </Route>

          <Route path="audio-gallery" element={<Typography>Audio Tools</Typography>}>
          </Route>
        </Routes>
      </Box>
    </BrowserRouter>
  );
}
export default App;
