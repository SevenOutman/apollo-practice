import { readFileSync } from "fs";
import { gql } from "graphql-tag";
import { Resolvers } from "../../__generated__/resolvers-types";
import path from "path";
import { ContextValue } from "../../context";
import { GraphQLError } from "graphql";

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
      return dataSources.postServiceRpc.getPostById(id);
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

  Mutation: {
    deletePost: async (_, { input }, { dataSources, user }) => {
      if (!user) {
        throw new GraphQLError("Not authenticated", {
          extensions: {
            code: "UNAUTHENTICATED",
          },
        });
      }

      const post = await dataSources.postServiceRpc.getPostById(input.id);

      if (!post) {
        throw new GraphQLError("Post not found.", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }

      if (post.userId !== user.id) {
        throw new GraphQLError("You are not authorized to delete this post.", {
          extensions: {
            code: "FORBIDDEN",
          },
        });
      }

      await dataSources.postServiceRpc.deletePost(input.id);

      return { post };
    },
  },
};
