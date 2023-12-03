import { z } from "zod";
import { createPostServiceClient } from "post-service/client";
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
};

export default class PostServiceRPC extends GRPCDataSource<Methods> {
  protected override serviceName = "PostService";
  protected override client = createPostServiceClient("localhost:50051");

  async getPostById(id: number) {
    return this.request("getPostById", { id }).then((response) =>
      PostSchema.parse(response.post)
    );
  }
}
