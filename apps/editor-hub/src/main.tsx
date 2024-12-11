import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/clerk-react";
import { UnauthenticatedUser } from "./components/auth-pages/UnauthenticatedUser.tsx";
import { PageViewerProvider } from "./contexts/PageViewer.context.tsx";
import {name, version, author} from '../package.json'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}
console.log("app:", name)
console.log("version:", version)
console.log("author:", author)

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl={"/"}>
      <SignedIn>
        <PageViewerProvider>
          <App />
        </PageViewerProvider>
      </SignedIn>

      <SignedOut>
        <UnauthenticatedUser />
      </SignedOut>
    </ClerkProvider>
  </StrictMode>
);
