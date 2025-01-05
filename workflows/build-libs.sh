#!/bin/bash

# Enable strict mode for better error handling
set -euo pipefail

# Root directory of the monorepo
ROOT_DIR="$(pwd)"

# Install dependencies for all workspaces
echo "Installing dependencies for all workspaces..."
bun i
echo "Dependencies installed successfully."

# Function to build a project
build_project() {
  local dir=$1
  echo "Building project in ${dir}..."
  cd "${dir}"
  bun run build
  echo "Build completed for ${dir}."
  cd - > /dev/null  # Return to the previous directory quietly
}

# Build each library
build_project "${ROOT_DIR}/libs/tag-system"
build_project "${ROOT_DIR}/libs/dropbox-types"
build_project "${ROOT_DIR}/libs/api-sdk"

echo "All builds completed successfully."
