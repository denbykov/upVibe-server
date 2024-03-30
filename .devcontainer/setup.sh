#!/bin/bash

echo "Establishing dependencies"
cd /workspaces/upVibe-server/server
if [[ -d "node_modules" ]]; then
    rm -rf node_modules
fi
npm install
npm run prebuild
echo "Completing the installation of dependencies"
echo "Linking docs api"
if [[ -d "/workspaces/upVibe-server/server/api" ]]; then
    rm -rf /workspaces/upVibe-server/server/api
fi
ln -s /workspaces/upVibe-server/docs/api /workspaces/upVibe-server/server/api
echo "End of setup.sh"
exit 0
