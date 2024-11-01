# Use the official Node.js image as the base image
FROM node:18

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and yarn.lock files to the working directory
COPY package.json yarn.lock ./

# Install the dependencies
RUN yarn install

# Copy the rest of the application code to the working directory
COPY . .

# Build the React application
RUN yarn build

# Install http-server globally
RUN yarn global add http-server

# Expose port 8080 to the outside world
EXPOSE 8080

# Start http-server to serve the built application
CMD ["http-server", "build", "-p", "8080"]