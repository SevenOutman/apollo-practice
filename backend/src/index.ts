require("dotenv").config();
import "./open-telemetry";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { buildSubgraphSchema } from "@apollo/subgraph";
import * as authSchema from "./subgraphs/auth";
import * as userSubgraph from "./subgraphs/user";
import * as todoSubgraph from "./subgraphs/todo";
import * as postSubgraph from "./subgraphs/post";
import * as commentSubgraph from "./subgraphs/comment";
import * as albumSubgraph from "./subgraphs/album";
import { ContextValue, context } from "./context";
import gql from "graphql-tag";
import { logger, messages } from "./logging";
import { disposeDisposables, logRequest } from "./plugins";

const server = new ApolloServer<ContextValue>({
  schema: buildSubgraphSchema([
    {
      typeDefs: gql`
        type Query {
          _empty: String
        }
        type Mutation {
          _empty: String
        }
        type PageInfo {
          hasNextPage: Boolean!
          hasPreviousPage: Boolean!
          startCursor: String
          endCursor: String
        }
      `,
    },
    authSchema,
    userSubgraph,
    todoSubgraph,
    postSubgraph,
    commentSubgraph,
    albumSubgraph,
  ]),
  plugins: [logRequest, disposeDisposables],
});

startStandaloneServer(server, {
  context,
  listen: { port: 4000 },
}).then(({ url }) => {
  logger.info(messages.info.serverStarted(url));
});
