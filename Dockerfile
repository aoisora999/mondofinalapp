# Build stage
FROM node:18-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Add Vercel-specific configuration
ENV PORT 8080
EXPOSE 8080

# Update nginx conf to use PORT environment variable
RUN sed -i.bak 's/listen\(.*\)80;/listen '"$PORT"';/' /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"] 
