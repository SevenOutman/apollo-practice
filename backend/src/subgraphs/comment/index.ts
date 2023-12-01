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
  Post: {
    comments: async ({ id }, _, { dataSources }) => {
      return dataSources.commentServiceRpc.listCommentsByPostId(id!) as any;
    },
  },
  Mutation: {
    createComment: async (_, { input }, { dataSources }) => {
      const comment = await dataSources.jsonplaceholderAPI.createComment(input);

      return { comment };
    },
  },
};
