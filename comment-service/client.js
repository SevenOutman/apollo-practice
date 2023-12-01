var grpc = require("@grpc/grpc-js");
const protoDescriptor = require("./protoDescriptor");

module.exports = function createClient(url) {
  return new protoDescriptor.apollo_practice.CommentService(
    url,
    grpc.credentials.createInsecure()
  );
};
