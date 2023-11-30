### Build ###
FROM node:18-alpine AS build
WORKDIR /usr/src/app
COPY . .
RUN npm ci && \
    npm run build

### Run ###
FROM nginx:1.17.1-alpine
COPY --from=build /usr/src/app/dist/reunice /usr/share/nginx/html
EXPOSE 80
