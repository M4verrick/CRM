# Makefile

# Variables
DOCKER_COMPOSE_FILE = docker-compose-local.yml

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

.PHONY: up down start-local stop-local