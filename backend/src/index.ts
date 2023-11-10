import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { readFileSync } from "fs";
import { Resolvers } from "./__generated__/resolvers-types";
import JsonPlaceholderAPI from "./jsonplaceholder-api";

const typeDefs = readFileSync("./schema.graphql", {
  encoding: "utf-8",
});

interface ContextValue {
  dataSources: {
    jsonplaceholderAPI: JsonPlaceholderAPI;
  };
}

const resolvers: Resolvers<ContextValue> = {
  Query: {
    users: async (_, __, { dataSources }) => {
      return dataSources.jsonplaceholderAPI.listUsers();
    },
    user: async (_, { id }, { dataSources }) => {
      const user = await dataSources.jsonplaceholderAPI.getUser(id);

      return user;
    },
  },
};

const server = new ApolloServer<ContextValue>({
  typeDefs,
  resolvers,
});

startStandaloneServer(server, {
  context: async () => {
    return {
      dataSources: {
        jsonplaceholderAPI: new JsonPlaceholderAPI(),
      },
    };
  },
  listen: { port: 4000 },
}).then(({ url }) => {
  console.log(`🚀  Server ready at: ${url}`);
});
