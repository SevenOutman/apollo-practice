require("./instrumentation");
const express = require("express");
const bodyParser = require("body-parser");
const { JSONRPCServer } = require("json-rpc-2.0");
const axios = require("axios");

const server = new JSONRPCServer();

// First parameter is a method name.
// Second parameter is a method itself.
// A method takes JSON-RPC params and returns a result.
// It can also return a promise of the result.
server.addMethod("echo", ({ text }) => text);
server.addMethod("log", ({ message }) => console.log(message));

server.addMethod("listUsers", () =>
  axios
    .get("https://jsonplaceholder.typicode.com/users")
    .then((res) => res.data)
);
server.addMethod("getUserById", (id) =>
  axios
    .get(`https://jsonplaceholder.typicode.com/users/${id}`)
    .then((res) => res.data)
);

const app = express();
app.use(bodyParser.json());

app.post("/json-rpc", (req, res) => {
  console.debug("request headers", req.headers);
  const jsonRPCRequest = req.body;
  // server.receive takes a JSON-RPC request and returns a promise of a JSON-RPC response.
  // It can also receive an array of requests, in which case it may return an array of responses.
  // Alternatively, you can use server.receiveJSON, which takes JSON string as is (in this case req.body).
  server.receive(jsonRPCRequest).then((jsonRPCResponse) => {
    if (jsonRPCResponse) {
      res.json(jsonRPCResponse);
    } else {
      // If response is absent, it was a JSON-RPC notification method.
      // Respond with no content status (204).
      res.sendStatus(204);
    }
  });
});

app.listen(4001, () => {
  console.log("JSON-RPC server is listening on port 4001");
});
