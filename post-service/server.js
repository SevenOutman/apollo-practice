require("./instrumentation");
const grpc = require("@grpc/grpc-js");
const protoDescriptor = require("./protoDescriptor");
const PostService = require("./services/PostService");
const CommentService = require("./services/CommentService");

const server = new grpc.Server();

server.addService(
  protoDescriptor.apollo_practice.PostService.service,
  PostService
);
server.addService(
  protoDescriptor.apollo_practice.CommentService.service,
  CommentService
);

server.bindAsync(
  "0.0.0.0:50051",
  grpc.ServerCredentials.createInsecure(),
  () => {
    server.start();
    console.log("Server running at http://0.0.0.0:50051");
  }
);
