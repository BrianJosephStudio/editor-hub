# Editor Hub API

The **Editor Hub API** serves as the backend for various Skillcapped tools developed by Brian Ure. It handles API operations for the apps, manages authentication, and supports interactions between the apps and services like Dropbox, Clerk, and Auth0.

This API works in conjunction with the **Editor Hub** and other tools, providing the necessary functionality to authenticate users, access Dropbox data, and perform other essential operations for the apps.

## Table of Contents

- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)
- [Usage](#usage)

---

## Installation

To get started with the Editor Hub API, follow these steps:

1. **Clone the Repository**  
   First, clone the repository to your local machine:
- `git clone https://github.com/BrianJosephStudio/editor-hub.git`
- `cd editor-hub`


2. **Install Dependencies**  
Install the required dependencies using `npm` or `bun`:
- `npm install`
Or if you're using `bun`:
- `bun install`

---

## Environment Variables

Make sure to set up the following environment variables before running the API:

1. **`PORT`**  
The port on which the API will run. Make sure that the same port is set up on all envs for all of the front end apps in '/apps'. By convention the port 5100 is used, but it can be any port of your choice.
- PORT=5100

2. **`REFRESH_TOKEN`**  
This is the Dropbox authentication token for the oauth workflow.
- REFRESH_TOKEN=your-refresh-token

3. **`CLIENT_ID`**  
The old Dropbox app's client ID. **This is being deprecated and won't be present in the future**.
- CLIENT_ID=your-client-id

4. **`CLIENT_SECRET`**  
The old Dropbox app's client secret. **This is being deprecated and won't be present in the future**.
- CLIENT_SECRET=your-client-secret

5. **`EDITOR_HUB_APP_KEY`**  
The new Dropbox app's client ID.
- EDITOR_HUB_APP_KEY=your-editor-hub-app-key

6. **`EDITOR_HUB_APP_SECRET`**  
The new Dropbox app client secret.
- EDITOR_HUB_APP_SECRET=your-editor-hub-app-secret

7. **`REDIRECT_URL`**  
The URL to redirect to after successful authentication, this is part of the oauth authentication flow implemented by the Dropbox API.
- REDIRECT_URL=https://your-app.com/callback

8. **`CLERK_PUBLISHABLE_KEY`**  
The public API key for Clerk.
- CLERK_PUBLISHABLE_KEY=your-clerk-publishable-key

9. **`CLERK_SECRET_KEY`**  
 The secret API key for Clerk.

 - CLERK_SECRET_KEY=your-clerk-secret-key

### Creating Environment Files

Create two environment files for different configurations:

1. **`.env.development`**  
This file will be used in development mode. Example:
- PORT=5100
- REFRESH_TOKEN=your-refresh-token
- CLIENT_ID=your-client-id
- CLIENT_SECRET=your-client-secret
- EDITOR_HUB_APP_KEY=your-editor-hub-app-key
- EDITOR_HUB_APP_SECRET=your-editor-hub-app-secret
- REDIRECT_URL=https://your-app.com/callback
- CLERK_PUBLISHABLE_KEY=your-clerk-publishable-key
- CLERK_SECRET_KEY=your-clerk-secret-key
- CLERK_SIGN_IN_URL=https://your-clerk-sign-in-url


2. **`.env.production`**  
This file will be used in production mode. Example:
- PORT=5100
- REFRESH_TOKEN=your-refresh-token
- CLIENT_ID=your-client-id
- CLIENT_SECRET=your-client-secret
- EDITOR_HUB_APP_KEY=your-editor-hub-app-key
- EDITOR_HUB_APP_SECRET=your-editor-hub-app-secret
- REDIRECT_URL=https://your-app.com/callback
- CLERK_PUBLISHABLE_KEY=your-clerk-publishable-key
- CLERK_SECRET_KEY=your-clerk-secret-key
- CLERK_SIGN_IN_URL=https://your-clerk-sign-in-url

---

## Scripts

The following scripts are available for running the server in development and production environments:

- **`dev`**: Starts the server in development mode using `bun`:

Or, if you're using `bun` directly:
bun src/server.ts

- **`serve`**: Starts the server in production mode using `bun`:

Or, if you're using `bun` directly:
bun src/server.ts

- **`deploy`**: Builds and runs the server in production mode using Docker:

---

## Usage

1. **Run the Server in Development Mode**  
 Start the server for local development:
npm run dev

2. **Run the Server in Production Mode**  
To run the server in production mode, use the `serve` or `deploy` script:
npm run serve

3. **Deploy to Production**  
If using Docker, deploy the server in a production environment:
npm run deploy

---

## Conclusion

The Editor Hub API is designed to manage and support the **Skillcapped tools** developed by Brian Ure. It interacts with services like **Dropbox** for clip management, **Clerk** for user authentication, and **Auth0** for additional authentication tasks. Once set up with the appropriate environment variables, the API can be run in both development and production environments.

For more details, refer to the documentation for the respective apps or services integrated with this API.