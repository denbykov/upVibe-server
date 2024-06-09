ARG BUILD_LOCATION=/build/server
ARG USERNAME=up-vibe
ARG USER_UID=1002
ARG USER_GID=$USER_UID

FROM node:20-alpine AS builder

ARG BUILD_LOCATION

WORKDIR ${BUILD_LOCATION}

COPY . .
COPY ["package.json", "package-lock.json*"]

RUN apk add openssl
RUN mkdir -p cert && \
    openssl req -x509 -newkey rsa:4096 -keyout cert/privatekey.key \
    -out cert/certificate.crt -days 365 -nodes -subj "/CN=localhost"

RUN npm install
RUN npm run prebuild
RUN npm run lint
RUN npm run build
# RUN yarn test-ci

FROM node:20-alpine AS final

RUN apk add --no-cache bash curl
ARG BUILD_LOCATION
ARG USERNAME
ARG USER_UID
ARG USER_GID

ENV APP_WORKDIR=/opt/upVibe/server

RUN apk add python3 py3-pip && \
  python3 -m venv /opt/upVibe/venv && \
  . /opt/upVibe/venv/bin/activate && \
  python3 -m pip install mutagen

RUN addgroup -g $USER_GID $USERNAME && \
    adduser -D -u $USER_UID -G $USERNAME $USERNAME

USER ${USERNAME}
WORKDIR ${APP_WORKDIR}

COPY --from=builder --chown=${USERNAME}:${USER_GID} ${BUILD_LOCATION}/dist ./dist
COPY --from=builder --chown=${USERNAME}:${USER_GID} ${BUILD_LOCATION}/package.json .
COPY --from=builder --chown=${USERNAME}:${USER_GID} ${BUILD_LOCATION}/package-lock.json .
COPY --from=builder --chown=${USERNAME}:${USER_GID} ${BUILD_LOCATION}/sql ./sql
COPY --from=builder --chown=${USERNAME}:${USER_GID} ${BUILD_LOCATION}/cert ./cert

RUN npm install --omit=dev --omit=optional

ENTRYPOINT [ "/bin/bash" ]
