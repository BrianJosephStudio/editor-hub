import "./App.css";
import { Box } from "@mui/material";
import { NavBar } from "./components/nav-bar/NavBar";
import { AppBanner } from "./components/app-banner/AppBanner";
import { VideoGallery } from "./components/pages/VideoGallery";
import { VideoGalleryProvider } from "./contexts/VideoGallery.context";

function App() {
  return (
    <>
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
        <AppBanner></AppBanner>
        {/* <NavBar></NavBar> */}
        <VideoGalleryProvider>
            <VideoGallery></VideoGallery>
        </VideoGalleryProvider>
      </Box>
    </>
  );
}
export default App;
