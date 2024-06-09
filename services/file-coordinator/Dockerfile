ARG BUILD_LOCATION=/build/services/file-coordinator

FROM node:20-alpine AS builder

ARG BUILD_LOCATION

WORKDIR ${BUILD_LOCATION}
ARG USERNAME=up-vibe
ARG USER_UID=1002
ARG USER_GID=$USER_UID

COPY . .
COPY ["package.json", "package-lock.json*"]

RUN addgroup -g $USER_GID $USERNAME && \
    adduser -D -u $USER_UID -G $USERNAME $USERNAME

RUN npm install
RUN npm run build
RUN npm run lint

USER $USERNAME

FROM node:20-alpine AS final

RUN apk add --no-cache bash curl
ARG BUILD_LOCATION

ENV APP_USER=up-vibe
ENV APP_GROUP=1002
ENV APP_WORKDIR=/opt/upVibe/services/file-coordinator

RUN addgroup -g 1002 up-vibe && \
    adduser -D -u 1002 -G up-vibe up-vibe

USER ${APP_USER}
WORKDIR ${APP_WORKDIR}

COPY --from=builder --chown=${APP_USER}:${APP_GROUP} ${BUILD_LOCATION}/dist ./dist
COPY --from=builder --chown=${APP_USER}:${APP_GROUP} ${BUILD_LOCATION}/package.json .
COPY --from=builder --chown=${APP_USER}:${APP_GROUP} ${BUILD_LOCATION}/package-lock.json .
COPY --from=builder --chown=${APP_USER}:${APP_GROUP} ${BUILD_LOCATION}/sql ./sql

RUN npm install --omit=dev --omit=optional

ENTRYPOINT [ "/bin/bash" ]
