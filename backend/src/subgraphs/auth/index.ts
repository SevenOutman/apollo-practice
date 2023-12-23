import { readFileSync } from "fs";
import { gql } from "graphql-tag";
import jwt from "jsonwebtoken";
import { Resolvers, User } from "../../__generated__/resolvers-types";
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
    viewer: async (_, __, { user }) => {
      return (user as User | undefined) ?? null;
    },
  },
  Mutation: {
    login: async (_, { input }, { dataSources }) => {
      const user = await dataSources.userServiceRpc.getUser(input.userId);
      if (!user) {
        throw new GraphQLError("Could not login", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }

      return {
        token: jwt.sign(user, process.env.JWT_SECRET as string),
      };
    },
  },
};
