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
    albums: async (_parent, { first }, { dataSources }) => {
      return dataSources.jsonplaceholderAPI.listAlbums({ first });
    },
    album: async (_parent, { id }, { dataSources }) => {
      return dataSources.jsonplaceholderAPI.getAlbumById(id);
    },
  },
  User: {
    albums: async ({ id }, { first }, { dataSources }) => {
      return dataSources.jsonplaceholderAPI.listAlbumsByUserId(id!, { first });
    },
  },

  Album: {
    creator: async ({ userId }, _, { dataSources }) => {
      return dataSources.jsonplaceholderAPI.getUser(userId!);
    },
    photos: async ({ id }, { first }, { dataSources }) => {
      return dataSources.jsonplaceholderAPI.listPhotosByAlbumId(id!, { first });
    },
  },
};
