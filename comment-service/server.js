var grpc = require("@grpc/grpc-js");
const protoDescriptor = require("./protoDescriptor");
// The protoDescriptor object has the full package hierarchy
var routeguide = protoDescriptor.apollo_practice;

function getServer() {
  var server = new grpc.Server();
  server.addService(routeguide.CommentService.service, {
    listCommentsByPostId,
  });
  return server;
}
var routeServer = getServer();
routeServer.bindAsync(
  "0.0.0.0:4002",
  grpc.ServerCredentials.createInsecure(),
  () => {
    routeServer.start();
  },
);

function listCommentsByPostId(call, callback) {
  const postId = call.request.postId;

  fetch(`https://jsonplaceholder.typicode.com/posts/${postId}/comments`)
    .then((res) => res.json())
    .then((comments) => {
      callback(null, { comments });
    });
}
