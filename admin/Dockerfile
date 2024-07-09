FROM node:16.14.0 as build

# Set the working directory
ARG ENV

# Install Chromium
RUN apt-get update && apt-get install -y chromium

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the source code into the container
COPY . .

# Set the environment variables
COPY .env .env

# Build the React app
RUN npm run build

# Step 2: Serve the React application using Nginx
FROM nginx:alpine

# Copy the built React app from the previous stage
COPY --from=build /app/build /usr/share/nginx/html

# Custom Nginx
COPY ./deploy/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]


