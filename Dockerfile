# Stage 1: Build the React application
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install pnpm

RUN pnpm install

COPY . .

# Run the build command
RUN npm run build

# Stage 2: Serve the application with Nginx
FROM nginx:alpine

COPY ./nginx.conf.template /etc/nginx/templates/nginx.conf.template

# Copy the build output from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html


# The default command to start Nginx
CMD ["nginx", "-g", "daemon off;"]