FROM node:20-alpine
WORKDIR /opt/upVibe
COPY . .
COPY ["package.json", "package-lock.json*"]
RUN npm install && mv node_modules ../
EXPOSE 3000
RUN chown -R node /opt/upVibe
USER node
CMD ["npm run prebuild", "&&", "npm run build"]
