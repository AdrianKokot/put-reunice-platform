### Build ###
FROM maven:3.6.1-jdk-11-slim AS build

RUN mkdir -p /workspace
WORKDIR /workspace
COPY pom.xml /workspace
COPY src /workspace/src
RUN mvn -f pom.xml clean package

### Run ###
FROM amazoncorretto:11-alpine-jdk
WORKDIR /app
COPY --from=build /workspace/target/*.jar ./app.jar
EXPOSE 8080

HEALTHCHECK --start-period=20s --interval=5s --timeout=10s --retries=5 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8080/api/health || exit 1

ENTRYPOINT ["java","-jar","app.jar"]
