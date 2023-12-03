const axios = require("axios");

function getPostById(call, callback) {
  axios
    .get(`https://jsonplaceholder.typicode.com/posts/${call.request.id}`)
    .then((res) => res.data)
    .then(
      (data) => callback(null, { post: data }),
      (err) => callback(err)
    );
}

module.exports = {
  getPostById,
};
