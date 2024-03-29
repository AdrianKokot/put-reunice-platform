# EUNICE Platform

This project is based on CMS prototype, the difference between the prototype and current state is available as [git diff](https://github.com/AdrianKokot/put-reunice-platform/compare/v1.0.0-cms-prototype...main)

## Code formatting

### Java

```bash
mvn spotless:apply # format code
mvn spotless:check # check if code is formatted
```

### TypeScript

```bash
npm run fix # format code and run eslint fix
```

## Running tests

### Java unit tests

```bash
mvn test
```

### Angular unit tests

```bash
npm run test
```

### Cypress end-to-end tests

```bash
npm run e2e
```

## Docker

### Run the application, rebuilding all images from source code
`docker compose up -d --build`

### Run the application using already built images
`docker compose up -d`

### Stop the application, but leave Docker Volumes intact
`docker compose down`

### Run only the backend service in container, frontend locally
```bash
docker compose up -d backend
cd frontend
npm install
npm start
```

### Running services

| URL | Service | Container |
| --- | --- | --- |
| localhost:8080 | spring-boot | backend |
| localhost:80 | nginx | frontend |
| localhost:8025 | mailpit ui | mailpit |
| localhost:1025 | mailpit smtp server | mailpit |
| localhost:5432 | postgres | postgres |
| localhost:8108 | typesense | typesense |

### Configure the application
Please read the instructions in the `.env.example` file (located in the main project directory). Copy the file and name it `.env`. Adjust all configuration variables in that file. When first deploying the application using `docker-compose`, the variable `DATABASE_SCHEMA_HANDLING_ON_STARTUP` should be set to `create`. Once deployed, the value should be changed to `validate` or `update`. Details can be found in the comments available in `.env.example` file.
