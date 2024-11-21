import "./App.css";
import { ClipBrowser } from "./components/clip-browser/ClipBrowser";
import { ClipViewer } from "./components/clip-viewer/ClipViewer";
import { FolderNavigationProvider } from "./context/FolderNavigationContext";
import { ClipViewerProvider } from "./context/ClipViewerContext";
import { TagsProvider } from "./context/TagsContext";
import { AppContext } from "./context/AppContext";
import { Box, Typography } from "@mui/material";
import { TagsManager } from "./components/tags-manager/TagsManager";
import { useRef } from "react";
import { KeybindProvider } from "./context/KeyBindContext";
import { TagsDisplay } from "./components/tags-display/TagsDisplay";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
} from "@clerk/clerk-react";
import clipTaggerLogo from "../public/editor-hub-clip-tagger-logo.svg";

function App() {
  const urlParams = new URLSearchParams(window.location.search);
  const currentPath = urlParams.get("path");
  const AppRoot = useRef<HTMLDivElement>(null);

  return (
    <AppContext.Provider value={{ AppRoot }}>
      <SignedIn>
        <KeybindProvider>
          <ClipViewerProvider>
            <TagsProvider>
              <FolderNavigationProvider currentPath={currentPath ?? ""}>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: '1fr 12fr 1fr',
                    alignItems: "center",
                    justifyContent: "flex-end",
                    width: "100%",
                    height: "4vh",
                    placeItems: 'center',
                    backgroundColor: 'hsl(0, 0%, 20%)'
                  }}
                >
                  <Box
                    component={"img"}
                    src={clipTaggerLogo}
                    sx={{
                      maxHeight: "2.6rem",
                      gridColumn: '2/3'
                    }}
                  />
                  <SignOutButton></SignOutButton>
                </Box>
                <Box
                  component={"div"}
                  ref={AppRoot}
                  tabIndex={0}
                  sx={{
                    margin: "0",
                    padding: "0",
                    display: "grid",
                    gridTemplateColumns: "2fr 8fr 3fr",
                    width: "100vw",
                    height: "96vh",
                    outline: "none",
                    // background: 'red'
                  }}
                >
                  <ClipBrowser></ClipBrowser>
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateRows: "6fr 3fr",
                      gridTemplateColumns: "100%",
                      minHeight: "0",
                      minWidth: "0",
                    }}
                  >
                    <ClipViewer></ClipViewer>
                    <TagsManager></TagsManager>
                  </Box>
                  <TagsDisplay></TagsDisplay>
                </Box>
              </FolderNavigationProvider>
            </TagsProvider>
          </ClipViewerProvider>
        </KeybindProvider>
      </SignedIn>

      <SignedOut>
        <Box
          component={"div"}
          id="signout-root"
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
            gap: "1rem",
          }}
        >
          <Box
            component={"img"}
            src={clipTaggerLogo}
            sx={{
              maxHeight: "3rem",
            }}
          />
          <Typography variant="h4">Welcome to the Clip Tagger!</Typography>
          <Typography
            variant="h6"
            sx={{
              fontWeight: "200",
            }}
          >
            You must be signed in to proceed
          </Typography>
          <SignInButton></SignInButton>
        </Box>
      </SignedOut>
    </AppContext.Provider>
  );
}

export default App;
