const grpc = require("@grpc/grpc-js");
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

  fetch(`https://jsonplaceholder.typicode.com/posts/${postId}/comments`)
    .then((res) => res.json())
    .then(
      (comments) => {
        callback(null, { comments });
      },
      (err) => callback(err)
    );
}

function createComment(call, callback) {
  fetch(`https://jsonplaceholder.typicode.com/comments`, {
    method: "POST",
    body: JSON.stringify(call.request),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
    .then((res) => res.json())
    .then(
      (data) => callback(null, { comment: data }),
      (err) => callback(err)
    );
}
