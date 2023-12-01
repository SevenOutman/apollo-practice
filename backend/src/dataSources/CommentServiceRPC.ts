import createClient from "comment-service/client";
import { logger } from "../logger";

export default class CommentServiceRPC {
  protected client = createClient("localhost:4002");

  async listCommentsByPostId(postId: number) {
    return new Promise((resolve, reject) => {
      logger.info("gRPC: ListCommentsByPostId", { postId });
      this.client.listCommentsByPostId({ postId }, function (err, response) {
        if (err) {
          reject(err);
        } else {
          resolve(response.comments);
        }
      });
    });
  }
}
