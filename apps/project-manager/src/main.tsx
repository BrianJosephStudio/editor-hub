import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ClerkProvider, SignedIn, SignedOut } from '@clerk/clerk-react'
import { UnauthenticatedUser } from './components/auth-pages/UnauthenticatedUser.tsx'
import { AuthorizationProvider } from './context/Authorization.context.tsx'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl={"/project-manager"}>
      <SignedIn>
        <AuthorizationProvider>
          <App />
        </AuthorizationProvider>
      </SignedIn>

      <SignedOut>
        <UnauthenticatedUser />
      </SignedOut>
    </ClerkProvider>
  </React.StrictMode>,
)
