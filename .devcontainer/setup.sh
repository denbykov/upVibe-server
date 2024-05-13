#!/bin/bash

echo "Installing dependencies"
cd /workspaces/upVibe-server/server
npm install
npm run prebuild

echo "Linking docs api"
rm -r /workspaces/upVibe-server/server/api
ln -s /workspaces/upVibe-server/docs/api /workspaces/upVibe-server/server/api

sudo ln -s /workspaces/upVibe-server/scripts /opt/upVibe/scripts

echo "End of setup.sh"
exit 0
