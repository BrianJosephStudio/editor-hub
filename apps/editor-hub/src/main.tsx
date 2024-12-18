import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/clerk-react";
import { UnauthenticatedUser } from "./components/auth-screens/UnauthenticatedUser.tsx";
import { name, version, author } from '../package.json'
import { Provider as ReduxProvider } from 'react-redux';
import store from './redux/store'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}
console.log("app:", name)
console.log("version:", version)
console.log("author:", author)

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl={"/editor-hub"}>
      <SignedIn>
        <ReduxProvider store={store}>
            <App />
        </ReduxProvider>
      </SignedIn>

      <SignedOut>
        <UnauthenticatedUser />
      </SignedOut>
    </ClerkProvider>
  </StrictMode>
);
