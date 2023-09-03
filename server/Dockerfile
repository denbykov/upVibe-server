FROM node:20-alpine

RUN mkdir -p /opt/app && chown -R 777 /opt/app && \
    mkdir -p /opt/app

WORKDIR /opt/app

COPY package.json /opt/app/package.json
RUN npm install
COPY /dist /opt/app/dist

EXPOSE 3000
