# CMS Prototype

## Authors:
- Damian Mielczarek
- Mateusz Olszewski
- Mateusz Matkowski
- Wiktoria Moczulak
- Marcin Szeląg (refactoring and preparing production release)

## Docker

### Run the application, rebuilding all images from source code
`docker-compose up -d --build`

### Run the application using already built images
`docker-compose up -d`

### Stop the application, but leave Docker Volumes intact
`docker-compose down`

### Configure the application
Please read the instructions in the `.env` file (located in the main project directory) and adjust all configuration variables in that file. When first deploying the application using `docker-compose`, the variable `DATABASE_SCHEMA_HANDLING_ON_STARTUP` should be set to `create`. Once deployed, the value should be changed to `validate` or `update`. Details can be found in the comments available in `.env` file.

## Extensions by Marcin Szeląg

### Useful links from the Docker host (currently running the application)
- [http://localhost/api/api-docs](http://localhost/api/api-docs) - OpenAPI 3 specification of the application's RESTful API (supplied by the SpringBoot Java backend component)
- [http://localhost/api/swagger-ui](http://localhost/api/swagger-ui) - Swagger UI documentation and test platform for the application's RESTful API
- [http://localhost/api/universities](http://localhost/api/universities) - exemplary RESTful API call using HTTP GET method (forwarded by nginx to the backend container)

### Useful links from other host on the Internet (assuming ms.cs.put.poznan.pl Docker host is running the application)
- [http://ms.cs.put.poznan.pl/api/api-docs](http://ms.cs.put.poznan.pl/api/api-docs) - OpenAPI 3 specification of the application's RESTful API (supplied by the SpringBoot Java backend component)
- [http://ms.cs.put.poznan.pl/api/swagger-ui](http://ms.cs.put.poznan.pl/api/swagger-ui) - Swagger UI documentation and test platform for the application's RESTful API
- [http://ms.cs.put.poznan.pl/api/universities](http://ms.cs.put.poznan.pl/api/universities) - exemplary RESTful API call using HTTP GET method (forwarded by nginx to the backend container)