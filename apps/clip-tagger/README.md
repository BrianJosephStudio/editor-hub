# Clip Tagger

**Clip Tagger** is a tool designed for Skillcapped members to tag clips that will appear in the **Editor Hub**. The Editor Hub is a Premiere extension that allows editors to search for events within clips without needing to watch them. Clips are tagged with relevant keywords, and editors can then search for these tags to find the specific moments they need, streamlining the editing workflow.

### Table of Contents

- [Installation](#installation)
- [Requirements](#requirements)
- [Scripts](#scripts)
- [Environment Variables](#environment-variables)
- [Usage](#usage)

---

## Setup

**Install Dependencies**  
   Install the required dependencies using `npm`:

- npm install
   

---

## Scripts

The following scripts are available for development and production builds:

- **`dev`**: Starts the development server using Vite for hot-reloading during development.
This will run the app in development mode.

- **`stage`**: Compiles TypeScript files and builds the app in development mode.
This command runs TypeScript compilation and then triggers a Vite build with the development mode configuration. This will allow you to fetch this app through the local server - which should be running - instead of the production one.

- **`build`**: Compiles TypeScript files and creates a production build of the app.
This will create an optimized production build for deployment.

---

## Environment Variables

The following environment variables are required to configure the app correctly:

1. **`VITE_API_HOST`**  
 The API host URL. In development, set this to `localhost:5100/api/v2`, and in production, set it to the production URL, `editor-hub.brianure.com/api/v2`.
 - Development:  
   ```
   VITE_API_HOST=http://localhost:5100/api/v2
   ```
 - Production:  
   ```
   VITE_API_HOST=https://editor-hub.brianure.com/api/v2
   ```

2. **`VITE_CLIPS_ROOT_FOLDER`**  
 This is the path to the Dropbox folder where the clips are stored. The app interacts with Dropbox’s API to upload and manage these clips.
 - Example:
   ```
   VITE_CLIPS_ROOT_FOLDER=/path/to/dropbox/folder
   ```

3. **`VITE_TAG_TEMPLATE_ID`**  
 The ID for the tag template in Dropbox. This is used for tagging clips with predefined templates. 
 - Example:
   ```
   VITE_TAG_TEMPLATE_ID=your-template-id
   ```

4. **`VITE_CLERK_PUBLISHABLE_KEY`**  
 This is the public API key for Clerk (authentication service). It’s used to authenticate users and provide access control in the app.
 - Example:
   ```
   VITE_CLERK_PUBLISHABLE_KEY=your-clerk-key
   ```

### Adding Environment Variables

I recommend creating environment-specific `.env` files to manage configurations:

1. **`.env.development`**  
 This file will be used when running the app in development mode (`npm run dev` or `npm run stage`). It should contain the development-specific settings:
- VITE_API_HOST=http://localhost:5100/api/v2
- VITE_CLIPS_ROOT_FOLDER=/path/to/dropbox/folder
- VITE_TAG_TEMPLATE_ID=your-template-id
- VITE_CLERK_PUBLISHABLE_KEY=your-clerk-key

2. **`.env.production`**  
This file will be used when building the app for production (`npm run build`). It should contain the production-specific settings:
- VITE_API_HOST=https://editor-hub.brianure.com/api/v2
- VITE_CLIPS_ROOT_FOLDER=/path/to/dropbox/folder
- VITE_TAG_TEMPLATE_ID=your-template-id
- VITE_CLERK_PUBLISHABLE_KEY=your-clerk-key

You can create these `.env.development` and `.env.production` files in the root of the project to separate your configuration for different environments.

---

## Usage

Once you've set up your environment variables, you're ready to use the Clip Tagger.

1. **Run the Development Server**  
To start the app in development mode with hot-reloading, run the following command:
npm run dev

2. **Build the App for Production**  
To create a production build of the app, use the `build` command:
npm run build

3. **Preview the Production Build**  
After building, you can preview the production build using:
npm run preview

---

## Conclusion

Clip Tagger helps Skillcapped editors efficiently tag and manage clips that will be used in the **Editor Hub**, allowing them to quickly find the clips they need based on tags. After setting up your environment variables and running the appropriate build or development scripts, you can start tagging clips and prepare them for use within the Editor Hub.