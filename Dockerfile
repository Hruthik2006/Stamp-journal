# Stage 1: Build the React application
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy the rest of the project files
COPY . .

# Build the app (compiles to the dist/ directory)
RUN npm run build

# Stage 2: Serve the compiled static files using Nginx
FROM nginx:1.25-alpine

# Copy the compiled production assets from Stage 1 to Nginx's default directory
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80 to the outside world
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
