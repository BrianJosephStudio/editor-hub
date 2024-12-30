import "./App.css";
import { AppProvider } from "./context/AppContext";
import { IsAuthorized, ProtectedRoute, UnauthorizedUser } from "./pages/clip-tagger/components/auth-pages/UnauthorizedUser";
import { NavBar } from "./pages/clip-tagger/components/nav-bar/NavBar";
import { AuthorizationProvider } from "./context/Authorization.context";
import { BrowserRouter } from "react-router";
import { ClipTagger } from "./pages/clip-tagger/ClipTagger";
import { Routes, Route } from "react-router-dom"
import { FolderNavigationProvider } from "./context/FolderNavigationContext";
import { ClipViewerProvider } from "./context/ClipViewerContext";
import { KeybindProvider } from "./context/KeyBindContext";
import { TagsProvider } from "./context/TagsContext";

function App() {
  const urlParams = new URLSearchParams(window.location.search);
  const currentPath = urlParams.get("path");

  return (
    <AppProvider>
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
                        <ClipTagger></ClipTagger>
                      </TagsProvider>
                    </ClipViewerProvider>
                  </FolderNavigationProvider>
                </KeybindProvider>
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
