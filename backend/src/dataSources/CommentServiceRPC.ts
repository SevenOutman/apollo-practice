import { z } from "zod";
import { createCommentServiceClient, grpc } from "post-service/client";
import { Comment, CreateCommentInput } from "../__generated__/resolvers-types";
import { GRPCDataSource } from "./abstract/GRPCDataSource";

const CommentSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
  body: z.string(),
});

type Methods = {
  listCommentsByPostId(request: { postId: number }): { comments: Comment[] };
  createComment(input: CreateCommentInput): { comment: Comment };
};

export default class CommentServiceRPC extends GRPCDataSource<Methods> {
  protected override serviceName = "CommentService";
  protected override client = createCommentServiceClient("localhost:50051");

  [Symbol.dispose]() {
    grpc.closeClient(this.client);
  }

  async listCommentsByPostId(postId: number) {
    return this.request("listCommentsByPostId", { postId }).then((response) =>
      CommentSchema.array().parse(response.comments)
    );
  }

  async createComment(
    input: CreateCommentInput
  ): Promise<Omit<Comment, "postId">> {
    return this.request("createComment", input).then((response) =>
      CommentSchema.parse(response.comment)
    );
  }
}
