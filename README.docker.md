# Docker Setup

This setup includes two Docker containers:
- Website (Node.js) running on port 2222
- PostgreSQL database running on port 2223

## Project Structure

- `Dockerfile`: Contains instructions for building the website container
- `docker-compose.yml`: Orchestrates the website and database containers

## Getting Started

To build and start the Docker containers:

```bash
docker-compose up --build
```

To run in detached mode:

```bash
docker-compose up -d --build
```

## Accessing the Services

- Website: http://localhost:2222
- Database:
  - Host: localhost
  - Port: 2223
  - Username: postgres
  - Password: postgres
  - Database: postgres
  - Connection string: postgresql://postgres:postgres@localhost:2223/postgres

## Stopping the Containers

```bash
docker-compose down
```

To remove volumes when stopping:

```bash
docker-compose down -v
``` 