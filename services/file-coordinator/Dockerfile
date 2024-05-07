ARG BUILD_LOCATION=/build/services/file-coordinator

FROM node:20-alpine AS builder

ARG BUILD_LOCATION

WORKDIR ${BUILD_LOCATION}

COPY . .
COPY package.json .

RUN yarn install --frozen-lockfile
RUN yarn lint

FROM node:20-alpine AS final

RUN apk add --no-cache bash curl
ARG BUILD_LOCATION

ENV APP_USER=node
ENV APP_GROUP=node
ENV APP_WORKDIR=/opt/upVibe/services/file-coordinator

USER ${APP_USER}
WORKDIR ${APP_WORKDIR}

COPY --from=builder --chown=${APP_USER}:${APP_GROUP} ${BUILD_LOCATION}/dist ./dist
COPY --from=builder --chown=${APP_USER}:${APP_GROUP} ${BUILD_LOCATION}/package.json .
COPY --from=builder --chown=${APP_USER}:${APP_GROUP} ${BUILD_LOCATION}/yarn.lock .
COPY --from=builder --chown=${APP_USER}:${APP_GROUP} ${BUILD_LOCATION}/sql ./sql

RUN yarn install --frozen-lockfile --production

ENTRYPOINT [ "/bin/bash" ]
