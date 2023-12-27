var grpc = require("@grpc/grpc-js");
const protoDescriptor = require("./protoDescriptor");

module.exports = {
  createPostServiceClient(url) {
    return new protoDescriptor.apollo_practice.PostService(
      url,
      grpc.credentials.createInsecure()
    );
  },
  createCommentServiceClient(url) {
    return new protoDescriptor.apollo_practice.CommentService(
      url,
      grpc.credentials.createInsecure()
    );
  },
  grpc
};
