#!/bin/bash

echo "Establishing dependencies"
cd /workspaces/upVibe-server/server
npm install
npm run prebuild
echo "Completing the installation of dependencies"
echo "Linking docs api"
ln -s /workspaces/upVibe-server/docs/api /workspaces/upVibe-server/server/api
echo "End of setup.sh"
exit 0
