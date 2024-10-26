# Use an official Maven image to build the application with Java 21
FROM maven:3.9.9-eclipse-temurin-21 AS build

# Set the working directory in the container
WORKDIR /app

# Copy the pom.xml file and download dependencies
COPY pom.xml /app/
COPY src /app/src

# Build the application
RUN mvn -f /app/pom.xml clean package -DskipTests

# Use an official OpenJDK runtime as a parent image with Java 21
FROM openjdk:21-jdk-slim

# Set the working directory in the container
WORKDIR /app

# Copy the packaged jar file from the build stage
COPY --from=build /app/target/crm-0.0.1-SNAPSHOT.jar app.jar

# Expose the port the application runs on
EXPOSE 8080

# Run the jar file with the production profile
ENTRYPOINT ["java", "-Dspring.profiles.active=production", "-jar", "app.jar"]