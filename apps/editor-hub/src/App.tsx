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
import { IsAuthorized, ProtectedRoute, UnauthorizedUser } from "./components/auth-screens/UnauthorizedUser";
import { AuthorizationProvider } from "./contexts/Authorization.context";
import { AppEnvironmentProvider } from "./contexts/AppEnvironment.context";
import { SettingsPage } from "./pages/settings/Settings";
import { SettingsProvider } from "./contexts/Settings.context";
import { AnimationTemplates } from "./pages/animation-templates/AnimationTemplates";
import { TemplatesProvider } from "./contexts/Templates.context";
import { AEComponent } from "./components/context-specific-components/ContextSpecificComponents";

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
        <AuthorizationProvider>
          <AppEnvironmentProvider>
            <NavBar></NavBar>
          </AppEnvironmentProvider>
          <SettingsProvider>
            <FileBrowserProvider>
              <Routes>
                <Route path="/" element={
                  <ProtectedRoute>

                    <Navigate to="/video-gallery" />
                  </ProtectedRoute>
                } />

                <Route path="video-gallery" element={
                  <ProtectedRoute>
                    <VideoGalleryProvider>
                      <VideoGallery></VideoGallery>
                    </VideoGalleryProvider>
                  </ProtectedRoute>
                } />

                <Route path="templates" element={
                  <AEComponent>
                    <ProtectedRoute>
                      <TemplatesProvider>
                        <AnimationTemplates></AnimationTemplates>
                      </TemplatesProvider>
                    </ProtectedRoute>
                  </AEComponent>
                } />

                <Route path="audio-gallery" element={
                  <ProtectedRoute>
                    <AudioGalleryProvider>
                      <AudioGallery></AudioGallery>
                    </AudioGalleryProvider>
                  </ProtectedRoute>
                } />

                <Route path="settings" element={
                  <ProtectedRoute>
                    <SettingsPage></SettingsPage>
                  </ProtectedRoute>
                } />

                <Route path="unauthorized" element={
                  <IsAuthorized>
                    <UnauthorizedUser />
                  </IsAuthorized>
                }></Route>
              </Routes>
            </FileBrowserProvider>
          </SettingsProvider>
        </AuthorizationProvider>
      </Box>
    </BrowserRouter>
  );
}

export default App;
