#!/bin/sh

# Build project
cd ~/WebstormProjects/folio/client
sed -i 's/VITE_API_DEV=true/VITE_API_DEV=false/' .env
echo Switched .env file to production.
npm run build
echo Finished building project.

# Setup folders for transfer
cd ~/Desktop
mkdir -p server
rm -r server/*

# Transfer files
rsync -av ~/WebstormProjects/folio/client/dist/ ~/Desktop/server/public
rsync -av --exclude=node_modules --exclude=folio.sqlite --exclude=folio-backup.sqlite  ~/WebstormProjects/folio/server/ ~/Desktop/server/
echo Transfered files to ~/Desktop/server

# Replace old files
ssh omen@omenmc.hopto.org -p 2024 'rm -r ~/server/public/assets && rm -r ~/server/public/routes && rm ~/server/public/*.json && rm ~/server/public/*.js'
cd ~/Desktop
rsync -avzh -e "ssh -p 2024" server omen@omenmc.hopto.org:/home/omen
echo Replaced old files on server.

# Set project back to dev mode
cd ~/WebstormProjects/folio/client
sed -i 's/VITE_API_DEV=false/VITE_API_DEV=true/' .env

echo Finished! Press Enter button to exit...
read input