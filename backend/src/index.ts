import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { buildSubgraphSchema } from "@apollo/subgraph";
import * as userSubgraph from "./subgraphs/user";
import * as todoSubgraph from "./subgraphs/todo";
import * as postSubgraph from "./subgraphs/post";
import * as commentSubgraph from "./subgraphs/comment";
import * as albumSubgraph from "./subgraphs/album";
import { ContextValue, context } from "./context";
import gql from "graphql-tag";

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
    userSubgraph,
    todoSubgraph,
    postSubgraph,
    commentSubgraph,
    albumSubgraph,
  ]),
});

startStandaloneServer(server, {
  context,
  listen: { port: 4000 },
}).then(({ url }) => {
  console.log(`🚀  Server ready at: ${url}`);
});
