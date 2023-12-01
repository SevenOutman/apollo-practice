import { readFileSync } from "fs";
import { gql } from "graphql-tag";
import { Resolvers } from "../../__generated__/resolvers-types";
import path from "path";
import { ContextValue } from "../../context";

export const typeDefs = gql(
  readFileSync(path.resolve(__dirname, "./schema.graphql"), {
    encoding: "utf-8",
  }),
);

export const resolvers: Resolvers<ContextValue> = {
  Query: {
    users: async (_, __, { dataSources }) => {
      return dataSources.userServiceRpc.listUsers();
    },
    user: async (_, { id }, { dataSources }) => {
      return dataSources.userServiceRpc.getUser(id);
    },
  },
};
