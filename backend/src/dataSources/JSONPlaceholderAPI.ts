import { z } from "zod";
import { RESTDataSource } from "./RESTDataSource";

const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  username: z.string(),
  email: z.string(),
  address: z.object({
    street: z.string(),
    suite: z.string(),
    city: z.string(),
    zipcode: z.string(),
    geo: z.object({ lat: z.string(), lng: z.string() }),
  }),
  phone: z.string(),
  website: z.string(),
  company: z.object({
    name: z.string(),
    catchPhrase: z.string(),
    bs: z.string(),
  }),
});

const TodoSchema = z.object({
  id: z.number(),
  title: z.string(),
  completed: z.boolean(),
});

const PostSchema = z.object({
  id: z.number(),
  title: z.string(),
  body: z.string(),
  userId: z.number(),
});

const CommentSchema = z.object({
  postId: z.number(),
  id: z.number(),
  name: z.string(),
  email: z.string(),
  body: z.string(),
});

const AlbumSchema = z.object({
  userId: z.number(),
  id: z.number(),
  title: z.string(),
});

const PhotoSchema = z.object({
  albumId: z.number(),
  id: z.number(),
  title: z.string(),
  url: z.string(),
  thumbnailUrl: z.string(),
});

class JsonPlaceholderAPI extends RESTDataSource {
  override baseURL = "https://jsonplaceholder.typicode.com";

  async listUsers() {
    return this.get("/users").then((data) => UserSchema.array().parse(data));
  }

  async getUser(id: number) {
    return this.get(`/users/${id}`).then((data) => UserSchema.parse(data));
  }

  async listTodosByUserId(userId: number) {
    return this.get(`/users/${userId}/todos`).then((data) =>
      TodoSchema.array().parse(data)
    );
  }

  async listPosts() {
    return this.get(`/posts`).then((data) => PostSchema.array().parse(data));
  }

  async getPostById(id: number) {
    return this.get(`/posts/${id}`).then((data) => PostSchema.parse(data));
  }

  async listPostsByUserId(userId: number, params?: { first?: number | null }) {
    return this.fetch(`/users/${userId}/posts`, {
      params: {
        _limit: params?.first,
      },
    }).then(({ response, parsedBody }) => ({
      headers: response.headers,
      body: PostSchema.array().parse(parsedBody),
    }));
  }

  async listCommentsByPostId(postId: number) {
    return this.get(`/posts/${postId}/comments`).then((data) =>
      CommentSchema.array().parse(data)
    );
  }

  async createComment(input: {
    postId: number;
    name: string;
    email: string;
    body: string;
  }) {
    return this.post(`/comments`, {
      body: JSON.stringify(input),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    }).then((data) => CommentSchema.parse(data));
  }

  async listAlbums(params?: { first?: number | null }) {
    return this.get(`/albums`, {
      params: {
        _limit: params?.first,
      },
    }).then((data) => AlbumSchema.array().parse(data));
  }

  async listAlbumsByUserId(userId: number, params?: { first?: number | null }) {
    return this.get(`/users/${userId}/albums`, {
      params: {
        _limit: params?.first,
      },
    }).then((data) => AlbumSchema.array().parse(data));
  }

  async getAlbumById(id: number) {
    return this.get(`/albums/${id}`).then((data) => AlbumSchema.parse(data));
  }

  async listPhotosByAlbumId(
    albumId: number,
    params?: { first?: number | null }
  ) {
    return this.get(`/albums/${albumId}/photos`, {
      params: {
        _limit: params?.first,
      },
    }).then((data) => PhotoSchema.array().parse(data));
  }
}

export default JsonPlaceholderAPI;