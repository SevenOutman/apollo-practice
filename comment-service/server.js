require("./instrumentation");
const grpc = require("@grpc/grpc-js");
const axios = require("axios");
const protoDescriptor = require("./protoDescriptor");

function getServer() {
  var server = new grpc.Server();
  server.addService(protoDescriptor.apollo_practice.CommentService.service, {
    listCommentsByPostId,
    createComment,
  });
  return server;
}

const routeServer = getServer();
routeServer.bindAsync(
  "0.0.0.0:50051",
  grpc.ServerCredentials.createInsecure(),
  () => {
    routeServer.start();
    console.log("Server running at http://0.0.0.0:50051");
  }
);

function listCommentsByPostId(call, callback) {
  const postId = call.request.postId;

  axios
    .get(`https://jsonplaceholder.typicode.com/posts/${postId}/comments`)
    .then((res) => res.data)
    .then(
      (comments) => {
        callback(null, { comments });
      },
      (err) => callback(err)
    );
}

function createComment(call, callback) {
  axios
    .post(`https://jsonplaceholder.typicode.com/comments`, call.request)
    .then((res) => res.data)
    .then(
      (data) => callback(null, { comment: data }),
      (err) => callback(err)
    );
}
