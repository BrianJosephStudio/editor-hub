import "./App.css";
import { AppProvider } from "./context/AppContext";
import { IsAuthorized, ProtectedRoute, UnauthorizedUser } from "./components/auth-pages/UnauthorizedUser";
import { NavBar } from "./components/nav-bar/NavBar";
import { AuthorizationProvider } from "./context/Authorization.context";
import { BrowserRouter } from "react-router";
import { ClipTagger } from "./pages/clip-tagger/ClipTagger";
import { Routes, Route } from "react-router-dom"
import { FolderNavigationProvider } from "./context/FolderNavigationContext";
import { ClipViewerProvider } from "./context/ClipViewerContext";
import { KeybindProvider } from "./context/KeyBindContext";
import { TagsProvider } from "./context/TagsContext";
import { ClipUploader } from "./pages/clip-uploader/ClipUploader";
import { ClipUploadProvider } from "./context/ClipUploadContext";
import { Toaster } from 'sonner';

function App() {
  const urlParams = new URLSearchParams(window.location.search);
  const currentPath = urlParams.get("path");

  return (
    <AppProvider>
      <Toaster richColors/>
      <BrowserRouter basename="clip-tagger">
        <AuthorizationProvider>
          <NavBar />
          <Routes>
            <Route path="/" element={
              <ProtectedRoute>
                <KeybindProvider>
                  <FolderNavigationProvider currentPath={currentPath ?? ""}>
                    <ClipViewerProvider>
                      <TagsProvider>
                        <ClipTagger />
                      </TagsProvider>
                    </ClipViewerProvider>
                  </FolderNavigationProvider>
                </KeybindProvider>
              </ProtectedRoute>
            } />
            <Route path="/upload" element={
              <ProtectedRoute adminOnly>
                <ClipUploadProvider>
                  <ClipUploader />
                </ClipUploadProvider>
              </ProtectedRoute>
            } />
            <Route path="unauthorized" element={
              <IsAuthorized>
                <UnauthorizedUser />
              </IsAuthorized>
            }></Route>
          </Routes>
        </AuthorizationProvider>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
