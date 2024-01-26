### Build ###
FROM node:18-alpine AS build-fe
WORKDIR /usr/src/app
COPY frontend/. .
RUN npm ci && \
    npm run build

### Build ###
FROM maven:3.6.1-jdk-11-slim AS build-be
RUN mkdir -p /workspace
WORKDIR /workspace
COPY backend/pom.xml /workspace
COPY backend/src /workspace/src
COPY --from=build-fe /usr/src/app/dist/eunice /workspace/src/main/resources/static
RUN mvn -f pom.xml clean package -DskipTests

### Run ###
FROM amazoncorretto:11-alpine-jdk
WORKDIR /workspace
COPY --from=build-be /workspace/target/*.jar app.jar
EXPOSE 8080

HEALTHCHECK --start-period=20s --interval=5s --timeout=10s --retries=5 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8080/api/health || exit 1

ENTRYPOINT ["java","-jar","app.jar"]
