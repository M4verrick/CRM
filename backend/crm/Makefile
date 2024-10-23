# Makefile

# Variables
DOCKER_COMPOSE_FILE = docker-compose-local.yml

# Build the JAR file using Maven
mvn-build:
	mvn clean package -DskipTests

# Clean the Maven project
clean:
	mvn clean

# Run the application using Docker Compose
up:
	docker-compose -f $(DOCKER_COMPOSE_FILE) up -d

# Stop the application and remove containers
down:
	docker-compose -f $(DOCKER_COMPOSE_FILE) down -v

# Start the application locally
start-local: mvn-build up

# Stop the application locally and clean the Maven project
stop-local: down clean

.PHONY: mvn-build clean up down start-local stop-local