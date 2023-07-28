### Build ###
FROM maven:3.6.1-jdk-11-slim AS build
#Expected arguments of Dockerfile
ARG APPLICATION_SERVER
ARG DATABASE_SCHEMA_HANDLING_ON_STARTUP
ARG DATABASE_SCHEMA_CREATE_TYPE
ARG SMTP_SERVE
ARG SMTP_PORT
ARG SMTP_USERNAME
ARG SMTP_PASSWORD
#Set env. variables to be used during container build
ENV APPLICATION_SERVER $APPLICATION_SERVER
ENV DATABASE_SCHEMA_HANDLING_ON_STARTUP $DATABASE_SCHEMA_HANDLING_ON_STARTUP
ENV DATABASE_SCHEMA_CREATE_TYPE $DATABASE_SCHEMA_CREATE_TYPE
ENV SMTP_SERVER $SMTP_SERVER
ENV SMTP_PORT $SMTP_PORT
ENV SMTP_USERNAME $SMTP_USERNAME
ENV SMTP_PASSWORD $SMTP_PASSWORD
#Do actual work
RUN mkdir -p /workspace
WORKDIR /workspace
COPY pom.xml /workspace
COPY src /workspace/src
RUN mvn -f pom.xml clean package

### Run ###
#In runtime container will have access to environmental variables defined in docker-compose.yml or in .env file read by docker-compose
FROM openjdk:11-jre-slim-buster
#Do actual work
COPY --from=build /workspace/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","app.jar"]