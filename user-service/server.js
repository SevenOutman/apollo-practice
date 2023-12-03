require("./instrumentation");
const express = require("express");
const bodyParser = require("body-parser");
const { expressHandler } = require("./json-rpc");

const app = express();
app.use(bodyParser.json());

app.post("/json-rpc", expressHandler);

app.listen(4001, () => {
  console.log("JSON-RPC server is listening on port 4001");
});
