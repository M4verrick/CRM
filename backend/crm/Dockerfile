# Use an official Maven image to build the application with Java 21
FROM maven:3.8.4-openjdk-21 AS build

# Set the working directory in the container
WORKDIR /app

# Copy the pom.xml file and download dependencies
COPY pom.xml .
RUN mvn dependency:go-offline

# Copy the source code and build the application
COPY src ./src
RUN mvn clean package -DskipTests

# Use an official OpenJDK runtime as a parent image with Java 21
FROM openjdk:21-jdk-slim

# Set the working directory in the container
WORKDIR /app

# Copy the packaged jar file from the build stage
COPY --from=build /app/target/crm-app.jar crm-app.jar

# Expose the port the application runs on
EXPOSE 8080

# Run the jar file with the production profile
ENTRYPOINT ["java", "-Dspring.profiles.active=production", "-jar", "app.jar"]