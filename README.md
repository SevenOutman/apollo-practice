# Apollo practice

This repo is a practice of using Apollo Server as a BFF that aggregates various backend services.

## Practices

- GraphQL -> TypeScript codegen (both client and server)
- Data sources (REST, gRPC, JSON RPC)
- JWT-based authentication
- Logging
- Plugins
- Tracing

## Architecture

```mermaid
  graph LR;

      subgraph Domestic
        frontend[Frontend] -- GraphQL -->bff[BFF]
        bff-- JSON RPC -->user-service["User service"]
        bff-- gRPC -->post-service["Post service"]
      end

      subgraph thrid-party[Third-party services]
        jsonplaceholder
      end

      bff-- REST API -->jsonplaceholder[JSONPlaceholder]
      user-service-- REST API -->jsonplaceholder
      post-service-- REST API -->jsonplaceholder
```

## Logging

Logging is done with Winston in a whitelist manner (implemented as a custom format).
Only registered messages are logged.

```ts
import { logger, messages } from "./logging";

logger.info(messages.info.serverStarted(url)); // info: Server started at http://localhost:4000

logger.info("Server started"); // info: Unregistered "info" level message
```

## Tracing

Tracing is reported in OpenTelemetry format to a local Jaeger instance.

Components with tracing include:

- BFF (incoming GraphQL requests, outgoing JSON RPC calls, outgoing gRPC calls)
- User service (incoming JSON RPC calls, outgoing REST API calls)
- Post service (incoming JSON RPC calls, outgoing REST API calls)

An example trace:

![Screenshot of Jaeger UI](./trace.png)

## TODO

- [ ] Authentication & authorization
- [ ] Figure out whether `ID` could be a number

## Run locally

Install dependencies:

```sh
pnpm i
```

Start user-service and post-service:

```sh
pnpm --filter=user-service dev
pnpm --filter=post-service dev
```

Start BFF and frontend:

```sh
pnpm --filter=backend dev
pnpm --filter=frontend dev
```

Start a Jaeger instance:

```sh
docker run --rm --name jaeger \
-e COLLECTOR_ZIPKIN_HOST_PORT=:9411 \
-p 6831:6831/udp \
-p 6832:6832/udp \
-p 5778:5778 \
-p 16686:16686 \
-p 4317:4317 \
-p 4318:4318 \
-p 14250:14250 \
-p 14268:14268 \
-p 14269:14269 \
-p 9411:9411 \
jaegertracing/all-in-one:1.51
```
