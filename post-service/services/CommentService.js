const axios = require("axios");

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

module.exports = {
  listCommentsByPostId,
  createComment,
};
