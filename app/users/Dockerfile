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

# Copy the rest of the application code
COPY . .

# Define the command to run RabbitMQ and your app
CMD ["/bin/bash", "-c", "source $HOME/.nvm/nvm.sh && nvm use v20.10.0 && npm run dev"]