### Build ###
FROM node:16.17.0-alpine AS build-fe
WORKDIR /usr/src/app
COPY frontend/package.json ./
RUN npm install --force
COPY frontend/. .
RUN npm run build

### Build ###
FROM maven:3.6.1-jdk-11-slim AS build-be
RUN mkdir -p /workspace
WORKDIR /workspace
COPY backend/pom.xml /workspace
COPY backend/src /workspace/src
COPY --from=build-fe /usr/src/app/dist/reunice /workspace/src/main/resources/static
RUN mvn -f pom.xml clean package -DskipTests

### Run ###
FROM openjdk:11-jre-slim-buster
WORKDIR /workspace
COPY --from=build-be /workspace/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","app.jar"]