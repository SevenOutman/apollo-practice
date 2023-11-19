/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\n  query GetAlbum($id: Int!) {\n    album(id: $id) {\n      title\n      creator {\n        name\n      }\n      photos {\n        id\n        title\n        url\n      }\n    }\n  }\n": types.GetAlbumDocument,
    "\n  query GetAlbums {\n    albums(first: 4) {\n      id\n      title\n      creator {\n        name\n      }\n      photos(first: 1) {\n        url\n      }\n    }\n  }\n": types.GetAlbumsDocument,
    "\n  query GetPost($id: Int!) {\n    post(id: $id) {\n      title\n      body\n      author {\n        name\n      }\n      comments {\n        id\n        name\n        email\n        body\n      }\n    }\n  }\n": types.GetPostDocument,
    "\n  mutation CreateComment($input: CreateCommentInput!) {\n    createComment(input: $input) {\n      comment {\n        id\n        name\n        email\n        body\n      }\n    }\n  }\n": types.CreateCommentDocument,
    "\n  query GetUser($id: Int!) {\n    user(id: $id) {\n      name\n      username\n      email\n      website\n      company {\n        name\n      }\n      address {\n        city\n      }\n      posts(first: 3) {\n        totalCount\n        edges {\n          node {\n            id\n            title\n            body\n          }\n        }\n      }\n      albums(first: 3) {\n        id\n        title\n        photos(first: 1) {\n          url\n        }\n      }\n    }\n  }\n": types.GetUserDocument,
    "\n  query GetUsers {\n    users {\n      id\n      name\n      username\n      email\n      address {\n        city\n      }\n    }\n  }\n": types.GetUsersDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetAlbum($id: Int!) {\n    album(id: $id) {\n      title\n      creator {\n        name\n      }\n      photos {\n        id\n        title\n        url\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetAlbum($id: Int!) {\n    album(id: $id) {\n      title\n      creator {\n        name\n      }\n      photos {\n        id\n        title\n        url\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetAlbums {\n    albums(first: 4) {\n      id\n      title\n      creator {\n        name\n      }\n      photos(first: 1) {\n        url\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetAlbums {\n    albums(first: 4) {\n      id\n      title\n      creator {\n        name\n      }\n      photos(first: 1) {\n        url\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetPost($id: Int!) {\n    post(id: $id) {\n      title\n      body\n      author {\n        name\n      }\n      comments {\n        id\n        name\n        email\n        body\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetPost($id: Int!) {\n    post(id: $id) {\n      title\n      body\n      author {\n        name\n      }\n      comments {\n        id\n        name\n        email\n        body\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  mutation CreateComment($input: CreateCommentInput!) {\n    createComment(input: $input) {\n      comment {\n        id\n        name\n        email\n        body\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation CreateComment($input: CreateCommentInput!) {\n    createComment(input: $input) {\n      comment {\n        id\n        name\n        email\n        body\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetUser($id: Int!) {\n    user(id: $id) {\n      name\n      username\n      email\n      website\n      company {\n        name\n      }\n      address {\n        city\n      }\n      posts(first: 3) {\n        totalCount\n        edges {\n          node {\n            id\n            title\n            body\n          }\n        }\n      }\n      albums(first: 3) {\n        id\n        title\n        photos(first: 1) {\n          url\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetUser($id: Int!) {\n    user(id: $id) {\n      name\n      username\n      email\n      website\n      company {\n        name\n      }\n      address {\n        city\n      }\n      posts(first: 3) {\n        totalCount\n        edges {\n          node {\n            id\n            title\n            body\n          }\n        }\n      }\n      albums(first: 3) {\n        id\n        title\n        photos(first: 1) {\n          url\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "\n  query GetUsers {\n    users {\n      id\n      name\n      username\n      email\n      address {\n        city\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetUsers {\n    users {\n      id\n      name\n      username\n      email\n      address {\n        city\n      }\n    }\n  }\n"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;