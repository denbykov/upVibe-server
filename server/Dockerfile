ARG BUILD_LOCATION=/build/server

FROM node:20-alpine AS builder

ARG BUILD_LOCATION

WORKDIR ${BUILD_LOCATION}

COPY . .
COPY package.json .

RUN apk add openssl
RUN mkdir -p auto-cert && \
    openssl req -x509 -newkey rsa:4096 -keyout auto-cert/privatekey.key \
    -out auto-cert/certificate.crt -days 365 -nodes -subj "/CN=localhost"

RUN yarn install
RUN yarn prebuild
RUN yarn lint
RUN yarn build
# RUN yarn test-ci

FROM node:20-alpine AS final

RUN apk add --no-cache bash curl
ARG BUILD_LOCATION

ENV APP_USER=node
ENV APP_GROUP=node
ENV APP_WORKDIR=/opt/upVibe/server

USER ${APP_USER}
WORKDIR ${APP_WORKDIR}

COPY --from=builder --chown=${APP_USER}:${APP_GROUP} ${BUILD_LOCATION}/dist ./dist
COPY --from=builder --chown=${APP_USER}:${APP_GROUP} ${BUILD_LOCATION}/package.json .
COPY --from=builder --chown=${APP_USER}:${APP_GROUP} ${BUILD_LOCATION}/yarn.lock .
COPY --from=builder --chown=${APP_USER}:${APP_GROUP} ${BUILD_LOCATION}/.yarnrc.yml .
COPY --from=builder --chown=${APP_USER}:${APP_GROUP} ${BUILD_LOCATION}/sql ./sql
COPY --from=builder --chown=${APP_USER}:${APP_GROUP} ${BUILD_LOCATION}/auto-cert ./auto-cert

RUN yarn install --frozen-lockfile --production

ENTRYPOINT [ "/bin/bash" ]
