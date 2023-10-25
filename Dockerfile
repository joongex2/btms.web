# Stage 1: Compile and Build angular codebase

# Use official node image as the base image
# FROM node:latest as build

# Set the working directory
# WORKDIR /usr/local/app

# Add the source code to app
# COPY ./ /usr/local/app/

# Install all the dependencies
# RUN apt-get update && apt-get install -y curl
# RUN npm install

# Generate the build of the application
# RUN npm run build


# Stage 2: Serve app with nginx server

# Use official nginx image as the base image
FROM nginx:latest
# Copy the build output to replace the default nginx contents.
# COPY --from=build /usr/local/app/dist /usr/share/nginx/html
# RUN npm run build:staging
#COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY /dist/fuse /usr/share/nginx/html

# Expose port 80
EXPOSE 80
#EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]

# FROM node:19.5.0-alpine3.17 AS builder
# WORKDIR /usr/src/app
# COPY package*.json ./
# RUN npm install
# COPY . .
# RUN npm run build:dev
# FROM nginx:1.19-alpine
# RUN rm -rf /usr/share/nginx/html/*
# COPY --from=builder /usr/src/app/dist /usr/share/nginx/html
# COPY nginx.conf /etc/nginx/nginx.conf

# EXPOSE 80
# EXPOSE 443