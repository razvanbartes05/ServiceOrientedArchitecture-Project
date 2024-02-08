# Use an official Node.js runtime as a parent image
FROM node:14

# Set the working directory to /user/app
WORKDIR /user/app

# Install NVM
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash

# Load NVM and install the desired Node.js version
RUN /bin/bash -c "source $HOME/.nvm/nvm.sh && nvm install v20.10.0 && nvm alias default v20.10.0"

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install app dependencies
RUN npm install

# Install RabbitMQ
RUN apt-get update && \
    apt-get install -y rabbitmq-server && \
    rm -rf /var/lib/apt/lists/*

# Expose the port the app runs on and RabbitMQ port
EXPOSE 3000 5672
EXPOSE 3001 5672
EXPOSE 3002 5672

# Copy the rest of the application code
COPY . .

# Define the command to run RabbitMQ and your app
CMD ["/bin/bash", "-c", "source $HOME/.nvm/nvm.sh && nvm use v20.10.0 && service rabbitmq-server start && npm run dev"]
