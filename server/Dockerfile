ARG BUILD_LOCATION=/build/server

FROM node:20-alpine AS builder

ARG BUILD_LOCATION

WORKDIR ${BUILD_LOCATION}

COPY . .
COPY ["package.json", "package-lock.json*"]

RUN npm install && mv node_modules ../
RUN npm run prebuild
RUN npm run lint
RUN npm run build
# RUN npm run test-ci

FROM node:20-alpine AS final

ARG BUILD_LOCATION

ENV APP_USER=node
ENV APP_GROUP=node
ENV APP_WORKDIR=/opt/upVibe/server

USER ${APP_USER}
WORKDIR ${APP_WORKDIR}

COPY --from=builder --chown=${APP_USER}:${APP_GROUP} ${BUILD_LOCATION}/dist ./dist
COPY --from=builder --chown=${APP_USER}:${APP_GROUP} ${BUILD_LOCATION}/package.json .
COPY --from=builder --chown=${APP_USER}:${APP_GROUP} ${BUILD_LOCATION}/package-lock.json .
COPY --from=builder --chown=${APP_USER}:${APP_GROUP} ${BUILD_LOCATION}/sql ./sql

RUN npm install --omit=dev --omit=optional

ENTRYPOINT [ "sh" ]
