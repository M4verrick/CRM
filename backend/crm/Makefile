# Makefile

# Variables
DOCKER_COMPOSE_FILE = docker-compose-local.yml
DOCKER_COMPOSE_FILE_PACKAGE = docker-compose-local-package.yml

# Run the application using Docker Compose
up:
	docker-compose -f $(DOCKER_COMPOSE_FILE) up -d

# Stop the application and remove containers
down:
	docker-compose -f $(DOCKER_COMPOSE_FILE) down -v

# Start the application locally
start-local: up

# Stop the application locally and clean the Maven project
stop-local: down

# Build the project and start the application locally using the package Docker Compose file
start-build-local:
	mvn clean package -DskipTests
	docker-compose -f $(DOCKER_COMPOSE_FILE_PACKAGE) up -d

# Stop the application locally and clean the Maven project
stop-clean-local:
	docker-compose -f $(DOCKER_COMPOSE_FILE_PACKAGE) down -v
	mvn clean

.PHONY: up down start-local stop-local start-build-local stop-clean-local