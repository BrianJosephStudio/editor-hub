import "./App.css";
import { AppProvider } from "./context/AppContext";
import { IsAuthorized, ProtectedRoute, UnauthorizedUser } from "./components/auth-pages/UnauthorizedUser";
import { NavBar } from "./components/nav-bar/NavBar";
import { AuthorizationProvider } from "./context/Authorization.context";
import { BrowserRouter } from "react-router";
import { ClipTagger } from "./pages/clip-tagger/ClipTagger";
import { Routes, Route } from "react-router-dom"

function App() {
  return (
    <AppProvider>
      <BrowserRouter basename="clip-tagger">
        <AuthorizationProvider>
          <NavBar />
          <Routes>
            <Route path="/" element={
              <ProtectedRoute>
                <ClipTagger></ClipTagger>
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
