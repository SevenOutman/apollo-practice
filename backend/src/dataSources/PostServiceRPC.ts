import { z } from "zod";
import { createPostServiceClient, grpc } from "post-service/client";
import { Post } from "../__generated__/resolvers-types";
import { GRPCDataSource } from "./abstract/GRPCDataSource";

const PostSchema = z.object({
  id: z.number(),
  title: z.string(),
  body: z.string(),
  userId: z.number(),
});

type Methods = {
  getPostById(request: { id: number }): Post[];
  deletePostById(request: { id: number }): void;
};

export default class PostServiceRPC extends GRPCDataSource<Methods> {
  protected override serviceName = "PostService";
  protected override client = createPostServiceClient("localhost:50051");

  [Symbol.dispose]() {
    grpc.closeClient(this.client);
  }

  async getPostById(id: number) {
    return this.request("getPostById", { id }).then((response) =>
      PostSchema.parse(response.post)
    );
  }

  async deletePost(id: number) {
    return this.request("deletePostById", { id });
  }
}
