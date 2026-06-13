# LLM Tracker

A lightweight proof-of-concept for tracking LLM usage in an event-driven architecture using Redis as a queue.

This repo demonstrates how an SDK can emit usage telemetry, a request handler service can enqueue events, and a separate consumer service can process those events asynchronously.

## Project structure

- `sdk/`
  - Mock tracker implementation
  - Builds tracking payloads for model name, input tokens, and output tokens
- `requestHandlerService/`
  - Flask app that receives tracking payloads via HTTP POST
  - Pushes events into a Redis queue
- `consumerService/`
  - TypeScript service that polls Redis and consumes queued events
- `timescaleDb/`
  - PostgreSQL/TimescaleDB Docker setup with a table for logs

## How it works

1. The SDK creates a tracking payload and sends it to `requestHandlerService`
2. `requestHandlerService` stores the payload in Redis with `LPUSH`
3. `consumerService` reads the payload with `RPOP`
4. The consumer processes the data and optionally persists it to the database

## Requirements

- Docker
- Docker Compose
- A valid `.env` file in the repo root with Redis and database settings

## Running the project

From the repo root:

```bash
docker compose up --build
```

This starts:

- `db` — PostgreSQL / TimescaleDB container
- `rhs` — request handler service on port `3004`
- `cs` — consumer service

## Environment variables

The Compose setup uses the root `.env` file for both `rhs` and `cs`.

This repository does not include the `.env` file, so you must create it locally before running the services.

### Required fields

- `UPSTASH_REDIS_REST_URL` — your Upstash Redis REST endpoint
- `UPSTASH_REDIS_REST_TOKEN` — your Upstash Redis REST token
- `QUEUE_NAME` — the queue key used by both request handler and consumer
- `DB_HOST` — database hostname
- `DB_PORT` — database port
- `DATABASE` — database name
- `DB_USER` — database user
- `DB_PASSWORD` — database password

### Example `.env`

```env
UPSTASH_REDIS_REST_URL=https://<your-upstash-host>.upstash.io
UPSTASH_REDIS_REST_TOKEN=<your-upstash-token>
QUEUE_NAME=firstQueue
DB_HOST=db
DB_PORT=5432
DATABASE=mydb
DB_USER=postgres
DB_PASSWORD=mysecret
```

> If you are running with Docker Compose, use `DB_HOST=db` so the consumer container can resolve the database service by its Compose service name.

### Formatting notes

- Do not include quotes around values unless the value itself contains spaces.
- Do not add trailing commas at the end of lines.
- Keep the `.env` file local and do not commit it to source control.

## Testing the flow

1. Send a POST to the request handler:

```bash
curl -X POST http://localhost:3004/ \
  -H 'Content-Type: application/json' \
  -d '{"modelName":"gpt-test","input_tokens":10,"output_tokens":20}'
```

2. The request handler pushes the payload into Redis.
3. The consumer polls Redis and handles the queued item.

## Important notes

- `requestHandlerService/main.py` currently logs received payloads and pushes them to the queue.
- `consumerService/src/consumer.ts` polls Redis in a loop and consumes events.
- If the container image is built from stale sources, rebuild with `docker compose up --build`.

## Useful files

- `consumerService/src/consumer.ts` — consumer logic
- `requestHandlerService/main.py` — HTTP enqueue endpoint
- `timescaleDb/init-scripts/01-setup.sql` — database table creation

## Next steps

- Replace the mock SDK and API integration with a real LLM transport layer
- Add robust error handling and retries for queue and DB failures
- Persist consumed events into the database table instead of console logging
