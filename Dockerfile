# Stage 1: Clone and setup dependencies
FROM node:20.11 as dependencies

WORKDIR /app

# Install Git
RUN apt-get update && apt-get install -y git

# Set environment variables for GitHub credentials
ARG GITHUB_USERNAME
ARG GITHUB_TOKEN

# Clone the repositories using HTTPS
RUN git clone https://${GITHUB_USERNAME}:${GITHUB_TOKEN}@git@github.com:futureismeta/eth-warsaw-frontend.git /app/web-client
RUN git clone https://${GITHUB_USERNAME}:${GITHUB_TOKEN}@git@github.com:futureismeta/eth-warsaw-server.git /app/server

# Install dependencies and link packages for Web Client
WORKDIR /app/web-client
RUN yarn install
RUN yarn build

WORKDIR /app/server
RUN yarn install
RUN yarn build

# Stage 2: Serve the application
FROM node:20.11

# Copy the build artifacts and node_modules from the dependencies stage
COPY --from=dependencies /app/server /app/server
COPY --from=dependencies /app/web-client /app/web-client

WORKDIR /app/server

# Expose the port the app runs on
EXPOSE 8080

# Start the server
CMD ["yarn", "workspace", "server", "start"]