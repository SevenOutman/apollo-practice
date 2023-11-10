import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { buildSubgraphSchema } from "@apollo/subgraph";
import * as userSubgraph from "./subgraphs/user";
import * as todoSubgraph from "./subgraphs/todo";
import * as postSubgraph from "./subgraphs/post";
import * as commentSubgraph from "./subgraphs/comment";
import { ContextValue, context } from "./context";

const server = new ApolloServer<ContextValue>({
  schema: buildSubgraphSchema([
    userSubgraph,
    todoSubgraph,
    postSubgraph,
    commentSubgraph,
  ]),
});

startStandaloneServer(server, {
  context,
  listen: { port: 4000 },
}).then(({ url }) => {
  console.log(`🚀  Server ready at: ${url}`);
});
