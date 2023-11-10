import { readFileSync } from "fs";
import { gql } from "graphql-tag";
import { Resolvers } from "../../__generated__/resolvers-types";
import path from "path";
import { ContextValue } from "../../context";

export const typeDefs = gql(
  readFileSync(path.resolve(__dirname, "./schema.graphql"), {
    encoding: "utf-8",
  })
);

export const resolvers: Resolvers<ContextValue> = {
  Query: {
    posts: async (_, __, { dataSources }) => {
      return dataSources.jsonplaceholderAPI.listPosts();
    },
  },
  Post: {
    author: async ({ userId }, _, { dataSources }) => {
      return dataSources.jsonplaceholderAPI.getUser(userId!);
    },
  },

  User: {
    posts: async ({ id }, _, { dataSources }) => {
      return dataSources.jsonplaceholderAPI.listPostsByUserId(id!);
    },
  },
};
