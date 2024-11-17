# CRM Application

## Makefile Commands

This project uses a `Makefile` to simplify common tasks. Below are the available commands (execute from crm directory):

- Builds the project in the container and starts the application.

```sh
make start-local
```

- Stops the application and removes the container and volumes.

```sh
make stop-local
```

- Builds the project using Maven in local environment and starts the application. Please ensure you have Maven and Java
  21 installed.

```sh
make start-build-local
```

- Stops the application and removes the container and volumes. Also clean up the jar file. Please ensure you have Maven
  installed.

```sh
make stop-local-clean
```

- Runs tests.

```sh
make test
```

## API Documentation

API can be found in Swagger file "swagger.yaml" or in Postman Collection from "postman.json".