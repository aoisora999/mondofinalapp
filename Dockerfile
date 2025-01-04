# Build stage
FROM node:18-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built assets
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Add bash for debugging if needed
RUN apk add --no-cache bash

# Make port 80 available
EXPOSE 80

# Start nginx and keep it in foreground
CMD ["nginx", "-g", "daemon off;"] 
