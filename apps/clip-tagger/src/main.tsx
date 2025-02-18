import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/clerk-react";
import { UnauthenticatedUser } from "./components/auth-pages/UnauthenticatedUser.tsx";
import { MobileDeviceWarningModal } from "./components/other/MobileDeviceWarningModal.tsx";
import MobileDetect from 'mobile-detect'
import { store } from './redux/store'
import { Provider } from 'react-redux'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

const md = new MobileDetect(navigator.userAgent)
const isMobile = md.mobile() && md.isPhoneSized()
console.log("isMobile", isMobile)

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {isMobile && <MobileDeviceWarningModal />}

    {!isMobile && (
      <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl={"/clip-tagger"}>
        <SignedIn>
          <Provider store={store}>
            <App />
          </Provider>
        </SignedIn>

        <SignedOut>
          <UnauthenticatedUser />
        </SignedOut>
      </ClerkProvider>
    )}
  </React.StrictMode>
);
