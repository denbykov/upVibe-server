#!/bin/bash

echo "Installing dependencies"
cd /workspaces/upVibe-server/server
rm -r node_modules
npm install && npm prebuild

rm -r /workspaces/upVibe-server/server/api
ln -s /workspaces/upVibe-server/docs/api /workspaces/upVibe-server/server/api

echo "Install dependencies for file-coordinator"
cd /workspaces/upVibe-server/services/file-coordinator
rm -r node_modules
npm install

echo "End of setup.sh"
exit 0
