FROM alpine:3.19 as builder
RUN apk add yarn

USER root
WORKDIR /home/root/plugin

COPY . .
RUN chown -R root /home/root/plugin
RUN yarn install
RUN yarn build

FROM scratch as final
COPY --from=builder /home/root/plugin/dist /artifacts/FileCoordinatorPlugin
