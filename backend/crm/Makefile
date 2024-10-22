# Makefile for managing Spring Boot application and LocalStack

# Variables
APP_NAME = crm
JAR_FILE = target/$(APP_NAME).jar
DOCKER_COMPOSE_FILE = ./localenv/docker-compose.yml

.PHONY: build run clean start-localenv stop-localenv start-app stop-app

# Build the Spring Boot application
build:
	mvn clean package

# Run the Spring Boot application
run: build
	java -jar $(JAR_FILE)

# Clean the project
clean:
	mvn clean

# Start LocalStack
start-localenv:
	docker-compose -f $(DOCKER_COMPOSE_FILE) up -d

# Stop LocalStack
stop-localenv:
	docker-compose -f $(DOCKER_COMPOSE_FILE) down

# Start the application and LocalStack
start-app: start-localenv run

# Stop the application and LocalStack
stop-app: stop-localenv