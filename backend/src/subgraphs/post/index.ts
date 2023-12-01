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
    post: async (_, { id }, { dataSources }) => {
      return dataSources.jsonplaceholderAPI.getPostById(id);
    },
  },
  Post: {
    author: async ({ userId }, _, { dataSources }) => {
      return dataSources.userServiceRpc.getUser(userId!);
    },
  },

  User: {
    posts: async ({ id }, { first }, { dataSources }) => {
      const { body, headers } =
        await dataSources.jsonplaceholderAPI.listPostsByUserId(id!, { first });

      return {
        edges: body.map((post) => ({ node: post, cursor: `post${post.id}` })),
        totalCount: headers.has("X-Total-Count")
          ? parseInt(headers.get("X-Total-Count")!)
          : null,
      };
    },
  },
};
