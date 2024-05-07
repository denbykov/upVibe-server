#!/bin/bash

echo "Establishing dependencies"
cd /workspaces/upVibe-server/server
yarn install && yarn prebuild
echo "Completing the installation of dependencies"
echo "Linking docs api"
rm -r /workspaces/upVibe-server/server/api
ln -s /workspaces/upVibe-server/docs/api /workspaces/upVibe-server/server/api
echo "End of setup.sh"
exit 0
