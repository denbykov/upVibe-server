#!/bin/bash

echo "Establishing dependencies"
cd /workspaces/upVibe-server/server
rm -r node_modules
npm install && yarn prebuild
echo "Completing the installation of dependencies"
echo "Linking docs api"
rm -r /workspaces/upVibe-server/server/api
ln -s /workspaces/upVibe-server/docs/api /workspaces/upVibe-server/server/api
echo "Install dependencies for file-coordinator"
cd /workspaces/upVibe-server/services/file-coordinator
rm -r node_modules
npm install
echo "End of setup.sh"
exit 0
