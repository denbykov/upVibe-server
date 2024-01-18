In order to run `docker-compose.yaml`, we need to configure the variables, for this, in the main directory of the project, we need to create a file `.env` where we specify the following properties:

- `POSTGRES_IMAGE`: The Docker image to use for the PostgreSQL database.
- `POSTGRES_PORT`: The port to expose for the PostgreSQL database.
- `POSTGRES_USER`: The username for the PostgreSQL database.
- `POSTGRES_PASSWORD`: The password for the PostgreSQL database.
- `POSTGRES_DB`: The name of the PostgreSQL database.

- `LIQUIBASE_IMAGE`: The Docker image to use for Liquibase.
- `LIQUIBASE_VOLUME_CONFIG`: The Docker volume to use for Liquibase configuration files.
- `LIQUIBASE_VOLUME_CHANGESETS`: The Docker volume to use for Liquibase changesets.
- `LIQUIBASE_VOLUME_PROPERTIES`: The Docker volume to use for Liquibase properties.

- `RABBITMQ_IMAGE`: The Docker image to use for RabbitMQ.
- `RABBITMQ_PORT`: The port to expose for RabbitMQ.
- `RABBITMQ_USER`: The username for RabbitMQ.
- `RABBITMQ_PASSWORD`: The password for RabbitMQ.

- `SERVER_CONTEXT`: The context for the server, typically the directory containing the server's code.
- `SERVER_DOCKERFILE`: The path to the Dockerfile for the server.
- `SERVER_PORT`: The port to expose for the server.
- `SERVER_INSPECT_PORT`: The inspect port to  expose for the server.
- `SERVER_VOLUME_LOGS`: The Docker volume to use for server logs.
- `SERVER_VOLUME_CONFIG`: The Docker volume to use for server configuration files.
- `SERVER_VOLUME_STORAGE`: The Docker volume to use for server storage.
- `SERVER_COMMAND_RUN`: The command to run the server.