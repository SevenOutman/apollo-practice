# Apollo practice

This repo is a practice of using Apollo Server as a BFF that aggregates various backend services.

## Practices

- GraphQL -> TypeScript codegen (both client and server)
- Data sources (REST, gRPC, JSON RPC)
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
