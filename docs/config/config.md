# Content

- [Content](#content)
  - [Information about configuration variables](#information-about-configuration-variables)
  - [Configuration settings](#configuration-settings)

## Information about configuration variables

**APP**: This object contains configuration options for the application, including its name, the port it runs on, the host it runs on, whether to use HTTPS, the path to the HTTPS key and certificate files, and the path to the storage directory.

- APP.name: The name of the application.

- APP.port: The port number that the application listens on.

- APP.host: The host that the application runs on.

- APP.use_https: Whether to use HTTPS for secure communication.

- APP.https_key: The path to the HTTPS private key file.

- APP.https_cert: The path to the HTTPS certificate file.

- APP.path_storage: The path to the storage directory used by the application.

**API**: This object contains configuration options for the API, including its URI, version, access token secret, refresh token secret, and the expiration times for the access and refresh tokens.

- API.uri: The URI of the API.

- API.version: The version of the API.

- API.access_token_secret: The secret used to sign access tokens.

- API.refresh_token_secret: The secret used to sign refresh tokens.

- API.access_token_secret_expires: The expiration time for access tokens.

- API.refresh_token_secret_expires: The expiration time for refresh tokens.

**DB**: This object contains configuration options for the database, including the host, port, username, password, database name, and the maximum number of connections.

- DB.host: The host name or IP address of the database server.

- DB.port: The port number that the database server listens on.

- DB.user: The username used to connect to the database.

- DB.password: The password used to connect to the database.

- DB.name: The name of the database.

- DB.max: The maximum number of connections that can be made to the database.

**RABBITMQ**: This object contains configuration options for RabbitMQ, including the host, port, username, password, and the names of two queues used for downloading and tagging YouTube videos.

- RABBITMQ.host: The host name or IP address of the RabbitMQ server.

- RABBITMQ.port: The port number that the RabbitMQ server listens on.

- RABBITMQ.user: The username used to connect to RabbitMQ.

- RABBITMQ.password: The password used to connect to RabbitMQ.

- RABBITMQ.downloading_youtube_queue: The name of the queue used for downloading YouTube videos.

- RABBITMQ.tagging_youtube_native_queue: The name of the queue used for tagging YouTube videos.

## Configuration settings

The configuration files are located in the following path:

> upVibe-server\server\config

Next, set the following variables in the `config.json` file:

```json
{
  "APP": {
    "name": "your value" -> string,
    "port": your value -> integer,
    "host": "your value (example: 0.0.0.0)" -> string,
    "use_https": your value -> boolean,
    "https_key": "your value" -> string,
    "https_cert": "your value" -> string,
    "path_storage": "your value" -> string
  },
  "API": {
    "uri": "your value" -> string,
    "version": "your value" -> string,
    "access_token_secret": "your value" -> string,
    "refresh_token_secret": "your value" -> string,
    "access_token_secret_expires": "your value (example: 1h; Format: s - second, h - hour, y-year)" -> string,
    "refresh_token_secret_expires": "your value (example: 1h; Format: s - second, h - hour, y-year)" -> string
  },
  "DB": {
    "host": "your value" -> string,
    "port": "your value" -> integer,
    "user": "your value" -> string,
    "password": "your value" -> string,
    "name": "your value" -> string,
    "max": "your value" -> integer
  },
  "RABBITMQ": {
    "host": "your value" -> string,
    "port": "your value" -> integer,
    "user": "your value" -> string,
    "password": "your value" -> string,
    "downloading_youtube_queue": "your value" -> string,
    "tagging_youtube_native_queue": "your value" -> string
  }
}
```

Example config:

```
{
  "APP": {
    "name": "up-vibe",
    "port": 3000,
    "host": "0.0.0.0",
    "use_https": true,
    "https_key": "config/ssl/privatekey.pem",
    "https_cert": "config/ssl/certificate.pem",
    "path_storage": "/opt/app/storage"
  },
  "API": {
    "uri": "up-vibe",
    "version": "v1",
    "access_token_secret": "1234-5678-9012-3456",
    "refresh_token_secret": "1234-5678-9012-3456",
    "access_token_secret_expires": "1h",
    "refresh_token_secret_expires": "1d"
  },
  "DB": {
    "host": "host.docker.internal",
    "port": 5432,
    "user": "admin",
    "password": "admin",
    "name": "up-vibe-dev",
    "max": 5
  },
  "RABBITMQ": {
    "host": "host.docker.internal",
    "port": 5672,
    "user": "admin",
    "password": "admin",
    "downloading_youtube_queue": "downloading/youtube",
    "tagging_youtube_native_queue": "tagging/youtube-native"
  }
}
```
