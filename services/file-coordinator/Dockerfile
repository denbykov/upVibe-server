ARG BUILD_LOCATION=/build/services/file-coordinator
ARG USERNAME=up-vibe
ARG USER_UID=1002
ARG USER_GID=$USER_UID

FROM node:20-alpine AS builder

ARG BUILD_LOCATION

WORKDIR ${BUILD_LOCATION}

COPY . .
COPY ["package.json", "package-lock.json*"]

RUN npm install
RUN npm run build
RUN npm run lint

FROM node:20-alpine AS final

RUN apk add --no-cache bash curl
ARG BUILD_LOCATION
ARG USERNAME
ARG USER_UID
ARG USER_GID

ENV APP_WORKDIR=/opt/upVibe/services/file-coordinator

RUN groupadd --gid $USER_GID $USERNAME && \
    useradd --uid $USER_UID --gid $USER_GID -m $USERNAME

USER ${USERNAME}
WORKDIR ${APP_WORKDIR}

COPY --from=builder --chown=${USERNAME}:${USER_GID} ${BUILD_LOCATION}/dist ./dist
COPY --from=builder --chown=${USERNAME}:${USER_GID} ${BUILD_LOCATION}/package.json .
COPY --from=builder --chown=${USERNAME}:${USER_GID} ${BUILD_LOCATION}/package-lock.json .
COPY --from=builder --chown=${USERNAME}:${USER_GID} ${BUILD_LOCATION}/sql ./sql

RUN npm install --omit=dev --omit=optional

ENTRYPOINT [ "/bin/bash" ]
