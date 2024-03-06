FROM node:20-alpine
ENV NODE_ENV=production
WORKDIR /opt/upVibe
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
COPY . .
RUN npm install --production --silent && mv node_modules ../
EXPOSE 3000
RUN chown -R node /opt/upVibe
USER node
