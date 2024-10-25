# Makefile

# Variables
DOCKER_COMPOSE_FILE = docker-compose-local.yml
DOCKER_COMPOSE_FILE_PACKAGE = docker-compose-local-package.yml
CRM_IMAGE_NAME = crm-app

# Run the application using Docker Compose
up:
	docker-compose -f $(DOCKER_COMPOSE_FILE) up -d

# Stop the application and remove containers
down:
	docker-compose -f $(DOCKER_COMPOSE_FILE) down -v

# Clean the CRM Docker image
clean-image:
	docker rmi -f $(CRM_IMAGE_NAME)

# Start the application locally
start-local: start-localstack up

# Stop the application locally and clean the Maven project
stop-local: stop-localstack down clean-image

# Build the project and start the application locally using the package Docker Compose file
start-build-local: start-localstack
	mvn clean package -DskipTests
	docker-compose -f $(DOCKER_COMPOSE_FILE_PACKAGE) up -d

# Stop the application locally and clean the Maven project
stop-local-clean: stop-localstack
	docker-compose -f $(DOCKER_COMPOSE_FILE_PACKAGE) down -v
	mvn clean
	docker rmi -f $(CRM_IMAGE_NAME)

make start-localstack:
	docker-compose -f docker-compose-localstack.yml up -d

make stop-localstack:
	docker-compose -f docker-compose-localstack.yml down -v

.PHONY: up down start-local stop-local start-build-local stop-clean-local clean-image start-localstack stop-localstack