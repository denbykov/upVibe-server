# Title: upVibe-server

# Description

This project is a server for managing various components of services. It allows users to conveniently upload files in one place, as well as find and manage additional information about the same files. The application also includes a user-friendly interface for managing a collection of files, adding new files.

The application was created using a combination of TypeScript, Express. The database is managed using PostgreSQL.

The project includes several functions, including:

User authentication and authorization
File uploading function
File parsing function
The project is designed to be scalable and extensible, with the ability to add new features and functions as needed. It is also designed to be user-friendly and intuitive, with a clean and modern interface.

Overall, this project provides a comprehensive file management solution with features for users.

# How to work with the project

This diagram shows the interaction of the server with its modules to work

<img style="display: block;margin-left: auto;margin-right: auto;
  width: 50%;" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAV8AAAGHCAYAAAAX2FHDAAAAAXNSR0IArs4c6QAAENx0RVh0bXhmaWxlACUzQ214ZmlsZSUyMGhvc3QlM0QlMjJhcHAuZGlhZ3JhbXMubmV0JTIyJTIwbW9kaWZpZWQlM0QlMjIyMDIzLTA4LTMwVDExJTNBNDMlM0E0NS43MjFaJTIyJTIwYWdlbnQlM0QlMjJNb3ppbGxhJTJGNS4wJTIwKFdpbmRvd3MlMjBOVCUyMDEwLjAlM0IlMjBXaW42NCUzQiUyMHg2NCklMjBBcHBsZVdlYktpdCUyRjUzNy4zNiUyMChLSFRNTCUyQyUyMGxpa2UlMjBHZWNrbyklMjBDaHJvbWUlMkYxMTYuMC4wLjAlMjBTYWZhcmklMkY1MzcuMzYlMjIlMjBldGFnJTNEJTIyTlhnVjl3dEpQc1F3WjhLd2UyVkglMjIlMjB2ZXJzaW9uJTNEJTIyMjEuNy4wJTIyJTNFJTBBJTIwJTIwJTNDZGlhZ3JhbSUyMG5hbWUlM0QlMjJQYWdlLTElMjIlMjBpZCUzRCUyMkc2S0lNQTN3TUlzMzRhM25pRFZmJTIyJTNFJTBBJTIwJTIwJTIwJTIwJTNDbXhHcmFwaE1vZGVsJTIwZHglM0QlMjIxNDM0JTIyJTIwZHklM0QlMjI3ODIlMjIlMjBncmlkJTNEJTIyMSUyMiUyMGdyaWRTaXplJTNEJTIyMTAlMjIlMjBndWlkZXMlM0QlMjIxJTIyJTIwdG9vbHRpcHMlM0QlMjIxJTIyJTIwY29ubmVjdCUzRCUyMjElMjIlMjBhcnJvd3MlM0QlMjIxJTIyJTIwZm9sZCUzRCUyMjElMjIlMjBwYWdlJTNEJTIyMSUyMiUyMHBhZ2VTY2FsZSUzRCUyMjElMjIlMjBwYWdlV2lkdGglM0QlMjI4NTAlMjIlMjBwYWdlSGVpZ2h0JTNEJTIyMTEwMCUyMiUyMG1hdGglM0QlMjIwJTIyJTIwc2hhZG93JTNEJTIyMCUyMiUzRSUwQSUyMCUyMCUyMCUyMCUyMCUyMCUzQ3Jvb3QlM0UlMEElMjAlMjAlMjAlMjAlMjAlMjAlMjAlMjAlM0NteENlbGwlMjBpZCUzRCUyMjAlMjIlMjAlMkYlM0UlMEElMjAlMjAlMjAlMjAlMjAlMjAlMjAlMjAlM0NteENlbGwlMjBpZCUzRCUyMjElMjIlMjBwYXJlbnQlM0QlMjIwJTIyJTIwJTJGJTNFJTBBJTIwJTIwJTIwJTIwJTIwJTIwJTIwJTIwJTNDbXhDZWxsJTIwaWQlM0QlMjJhbzNwbWlJQndHLVQxSWJYcS14Zy04JTIyJTIwc3R5bGUlM0QlMjJlZGdlU3R5bGUlM0RvcnRob2dvbmFsRWRnZVN0eWxlJTNCcm91bmRlZCUzRDAlM0JvcnRob2dvbmFsTG9vcCUzRDElM0JqZXR0eVNpemUlM0RhdXRvJTNCaHRtbCUzRDElM0JlbnRyeVglM0QwJTNCZW50cnlZJTNEMC41JTNCZW50cnlEeCUzRDAlM0JlbnRyeUR5JTNEMCUzQiUyMiUyMGVkZ2UlM0QlMjIxJTIyJTIwcGFyZW50JTNEJTIyMSUyMiUyMHNvdXJjZSUzRCUyMmFvM3BtaUlCd0ctVDFJYlhxLXhnLTElMjIlMjB0YXJnZXQlM0QlMjJhbzNwbWlJQndHLVQxSWJYcS14Zy0zJTIyJTNFJTBBJTIwJTIwJTIwJTIwJTIwJTIwJTIwJTIwJTIwJTIwJTNDbXhHZW9tZXRyeSUyMHJlbGF0aXZlJTNEJTIyMSUyMiUyMGFzJTNEJTIyZ2VvbWV0cnklMjIlMjAlMkYlM0UlMEElMjAlMjAlMjAlMjAlMjAlMjAlMjAlMjAlM0MlMkZteENlbGwlM0UlMEElMjAlMjAlMjAlMjAlMjAlMjAlMjAlMjAlM0NteENlbGwlMjBpZCUzRCUyMmFvM3BtaUlCd0ctVDFJYlhxLXhnLTElMjIlMjB2YWx1ZSUzRCUyMk1haW4lMjBzZXJ2ZXIlMjIlMjBzdHlsZSUzRCUyMnJvdW5kZWQlM0QwJTNCd2hpdGVTcGFjZSUzRHdyYXAlM0JodG1sJTNEMSUzQiUyMiUyMHZlcnRleCUzRCUyMjElMjIlMjBwYXJlbnQlM0QlMjIxJTIyJTNFJTBBJTIwJTIwJTIwJTIwJTIwJTIwJTIwJTIwJTIwJTIwJTNDbXhHZW9tZXRyeSUyMHglM0QlMjIzMzAlMjIlMjB5JTNEJTIyNDYwJTIyJTIwd2lkdGglM0QlMjIxMjAlMjIlMjBoZWlnaHQlM0QlMjI2MCUyMiUyMGFzJTNEJTIyZ2VvbWV0cnklMjIlMjAlMkYlM0UlMEElMjAlMjAlMjAlMjAlMjAlMjAlMjAlMjAlM0MlMkZteENlbGwlM0UlMEElMjAlMjAlMjAlMjAlMjAlMjAlMjAlMjAlM0NteENlbGwlMjBpZCUzRCUyMmFvM3BtaUlCd0ctVDFJYlhxLXhnLTIlMjIlMjB2YWx1ZSUzRCUyMlBvc3RncmVTUUwlMjIlMjBzdHlsZSUzRCUyMnJvdW5kZWQlM0QwJTNCd2hpdGVTcGFjZSUzRHdyYXAlM0JodG1sJTNEMSUzQiUyMiUyMHZlcnRleCUzRCUyMjElMjIlMjBwYXJlbnQlM0QlMjIxJTIyJTNFJTBBJTIwJTIwJTIwJTIwJTIwJTIwJTIwJTIwJTIwJTIwJTNDbXhHZW9tZXRyeSUyMHglM0QlMjIzMzAlMjIlMjB5JTNEJTIyMzEwJTIyJTIwd2lkdGglM0QlMjIxMjAlMjIlMjBoZWlnaHQlM0QlMjI2MCUyMiUyMGFzJTNEJTIyZ2VvbWV0cnklMjIlMjAlMkYlM0UlMEElMjAlMjAlMjAlMjAlMjAlMjAlMjAlMjAlM0MlMkZteENlbGwlM0UlMEElMjAlMjAlMjAlMjAlMjAlMjAlMjAlMjAlM0NteENlbGwlMjBpZCUzRCUyMmFvM3BtaUlCd0ctVDFJYlhxLXhnLTMlMjIlMjB2YWx1ZSUzRCUyMlJhYmJpdE1RJTIyJTIwc3R5bGUlM0QlMjJyb3VuZGVkJTNEMCUzQndoaXRlU3BhY2UlM0R3cmFwJTNCaHRtbCUzRDElM0IlMjIlMjB2ZXJ0ZXglM0QlMjIxJTIyJTIwcGFyZW50JTNEJTIyMSUyMiUzRSUwQSUyMCUyMCUyMCUyMCUyMCUyMCUyMCUyMCUyMCUyMCUzQ214R2VvbWV0cnklMjB4JTNEJTIyNTUwJTIyJTIweSUzRCUyMjMxMCUyMiUyMHdpZHRoJTNEJTIyMTIwJTIyJTIwaGVpZ2h0JTNEJTIyNjAlMjIlMjBhcyUzRCUyMmdlb21ldHJ5JTIyJTIwJTJGJTNFJTBBJTIwJTIwJTIwJTIwJTIwJTIwJTIwJTIwJTNDJTJGbXhDZWxsJTNFJTBBJTIwJTIwJTIwJTIwJTIwJTIwJTIwJTIwJTNDbXhDZWxsJTIwaWQlM0QlMjJhbzNwbWlJQndHLVQxSWJYcS14Zy01JTIyJTIwdmFsdWUlM0QlMjIlMjIlMjBzdHlsZSUzRCUyMmVkZ2VTdHlsZSUzRG9ydGhvZ29uYWxFZGdlU3R5bGUlM0Jyb3VuZGVkJTNEMCUzQm9ydGhvZ29uYWxMb29wJTNEMSUzQmpldHR5U2l6ZSUzRGF1dG8lM0JodG1sJTNEMSUzQiUyMiUyMGVkZ2UlM0QlMjIxJTIyJTIwcGFyZW50JTNEJTIyMSUyMiUyMHNvdXJjZSUzRCUyMmFvM3BtaUlCd0ctVDFJYlhxLXhnLTQlMjIlMjB0YXJnZXQlM0QlMjJhbzNwbWlJQndHLVQxSWJYcS14Zy0yJTIyJTNFJTBBJTIwJTIwJTIwJTIwJTIwJTIwJTIwJTIwJTIwJTIwJTNDbXhHZW9tZXRyeSUyMHJlbGF0aXZlJTNEJTIyMSUyMiUyMGFzJTNEJTIyZ2VvbWV0cnklMjIlMjAlMkYlM0UlMEElMjAlMjAlMjAlMjAlMjAlMjAlMjAlMjAlM0MlMkZteENlbGwlM0UlMEElMjAlMjAlMjAlMjAlMjAlMjAlMjAlMjAlM0NteENlbGwlMjBpZCUzRCUyMmFvM3BtaUlCd0ctVDFJYlhxLXhnLTQlMjIlMjB2YWx1ZSUzRCUyMkxpcXVpYmFzZSUyMiUyMHN0eWxlJTNEJTIycm91bmRlZCUzRDAlM0J3aGl0ZVNwYWNlJTNEd3JhcCUzQmh0bWwlM0QxJTNCJTIyJTIwdmVydGV4JTNEJTIyMSUyMiUyMHBhcmVudCUzRCUyMjElMjIlM0UlMEElMjAlMjAlMjAlMjAlMjAlMjAlMjAlMjAlMjAlMjAlM0NteEdlb21ldHJ5JTIweCUzRCUyMjMzMCUyMiUyMHklM0QlMjIxNDAlMjIlMjB3aWR0aCUzRCUyMjEyMCUyMiUyMGhlaWdodCUzRCUyMjYwJTIyJTIwYXMlM0QlMjJnZW9tZXRyeSUyMiUyMCUyRiUzRSUwQSUyMCUyMCUyMCUyMCUyMCUyMCUyMCUyMCUzQyUyRm14Q2VsbCUzRSUwQSUyMCUyMCUyMCUyMCUyMCUyMCUyMCUyMCUzQ214Q2VsbCUyMGlkJTNEJTIyYW8zcG1pSUJ3Ry1UMUliWHEteGctOSUyMiUyMHZhbHVlJTNEJTIyJTIyJTIwc3R5bGUlM0QlMjJlbmRB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" style="cursor:pointer;max-width:100%;" onclick="(function(img){if(img.wnd!=null&&!img.wnd.closed){img.wnd.focus();}else{var r=function(evt){if(evt.data=='ready'&&evt.source==img.wnd){img.wnd.postMessage(decodeURIComponent(img.getAttribute('src')),'*');window.removeEventListener('message',r);}};window.addEventListener('message',r);img.wnd=window.open('https://viewer.diagrams.net/?client=1&page=0&edit=_blank');}})(this);"/>

# Content

- [Title: upVibe-server](#title-upvibe-server)
- [Description](#description)
- [How to work with the project](#how-to-work-with-the-project)
- [Content](#content)
- [Getting started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
    - [PostgreSQL](#postgresql)
    - [Liquibase](#liquibase)
    - [RabbitMQ](#rabbitmq)
    - [Server](#server)
- [Glossary](#glossary)
- [References](#references)
- [Credits](#credits)
- [License](#license)

# Getting started

## Prerequisites

Before you can run this project, you need to have Docker installed on your machine. If you don't have Docker installed, you can download it from the official website:

- [Docker for Mac](https://docs.docker.com/docker-for-mac/install/)
- [Docker for Windows](https://docs.docker.com/docker-for-windows/install/)
- [Docker for Linux](https://docs.docker.com/engine/install/)

## Installation

Here are the instructions to clone the project:

1. Open your terminal or command prompt.
2. Navigate to the directory where you want to clone the project.
3. Run the following command to clone the project:

```console
$ git clone https://github.com/denbykov/upVibe-server.git
```

4. Once the cloning process is complete, navigate to the cloned project directory:

```console
$ cd upVibe-server
```

That's it! You have successfully cloned the upVibe-server project.

After installing Docker, you can run the following command to build and run additional modules for the project, which are located under the following path

```console
$ cd scripts
```

Next, you need to run the containers in the following order:

1. db
   1. postgresql
   2. liquibase
2. rabbitmq

### PostgreSQL

To start the db/postgresql container, you need to do the following:
First, we need to go to the directory with the service, and then configure its configuration file:

```console
$ cd db
$ notepad .\env or nano .\env
```

We need to configure the following variables:

> POSTGRES_USER="your value"
>
> POSTGRES_PASSWORD="your value"
>
> POSTGRES_DB="your value"

Then build and run the container with the following command

```console
$ docker compose -f .\docker-compose-postgresql.yml -p postgresql up -d
```

### Liquibase

To start the db/liquibase container, you need to do the following:
First, we need to go to the directory with the service, and then configure its configuration file:

```console
$ cd db
$ notepad .\env or nano .\env
```

We need to configure the following variables:

> CHANGELOG="your value"

Then build and run the container with the following command

```console
$ docker compose -f .\docker-compose-liquibase.yml -p liquibase up -d
```

### RabbitMQ

To start the db/rabbitmq container, you need to do the following:
First, we need to go to the directory with the service, and then configure its configuration file:

```console
$ cd rabbitmq
$ notepad .\env or nano .\env
```

We need to configure the following variables:

> RABBITMQ_DEFAULT_USER="your value"
>
> RABBITMQ_DEFAULT_PASS="your value"

Then build and run the container with the following command

```console
$ docker compose -f .\docker-compose.yml -p rabbitmq up -d
```

### Server

Before launching the server, we need to set up its configuration. The path to the configuration is as follows:

> upVibe-server\server\config\config.json

Where we need to set the following variables:

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

It remains only to launch our server container, this is done as follows, we go to the head of the "upVibe-server" directory, and then run the following command:

```console
$ docker-compose -f .\docker-compose.dev.yml -p dev-app build --no-cache -up -d
```

# Glossary

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

# References

- [Docker](https://www.docker.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [Liquibase](https://www.liquibase.org/)
- [RabbitMQ](https://www.rabbitmq.com/)
- [Node.js](https://nodejs.org/en/)
- [Express](https://expressjs.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [TypeORM](https://typeorm.io/)
- [Jest](https://jestjs.io/)
- [Swagger](https://swagger.io/)
- [Docker Compose](https://docs.docker.com/compose/)

# Credits

Volodymyr Fihurniak

description: developer

Contact information:

- [github](https://github.com/VolodymyrFihurniak)
- [linkedin](https://www.linkedin.com/in/volodymyr-fihurniak/)
- [email](mailto:volodymyr.fihurniak@gmail.com)

Denys Bykov

description: developer

Contact information:

- [github](https://github.com/denbykov)
- [linkedin](https://www.linkedin.com/in/denys-bykov-012914273/)

# License

Copyright (c) 2023 Volodymyr Fihurniak and Denys Bykov

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
