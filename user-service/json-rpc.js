const { JSONRPCServer } = require("json-rpc-2.0");
const axios = require("axios");
const { trace, SpanStatusCode, SpanKind } = require("@opentelemetry/api");

const serviceName = "apollo_practice.user-service";

const methods = {
  listUsers: () =>
    axios
      .get("https://jsonplaceholder.typicode.com/users")
      .then((res) => res.data),
  getUserById: (id) =>
    axios
      .get(`https://jsonplaceholder.typicode.com/users/${id}`)
      .then((res) => res.data),
};

const server = new JSONRPCServer();
Object.getOwnPropertyNames(methods).forEach((methodName) => {
  server.addMethod(methodName, methods[methodName]);
});

const tracer = trace.getTracer("default");
let messageCounter = 1;

const expressHandler = (req, res) => {
  const jsonRPCRequest = req.body;

  tracer.startActiveSpan(
    serviceName + "/" + jsonRPCRequest.method,
    {
      kind: SpanKind.SERVER,
      attributes: {
        /**
         * RPC Common Attributes
         * @see https://opentelemetry.io/docs/specs/semconv/rpc/rpc-spans/#common-attributes
         */
        "server.address": req.socket.localAddress,
        "server.port": req.socket.localPort,
        "rpc.system": "jsonrpc",
        "rpc.service": serviceName,
        "rpc.method": jsonRPCRequest.method,

        /**
         * RPC Server Attributes
         */
        "client.address":
          req.headers["x-forwarded-for"] || req.socket.remoteAddress,
        "client.port": req.socket.remotePort,

        /**
         * JSON RPC Attributes
         * @see https://opentelemetry.io/docs/specs/semconv/rpc/json-rpc/#json-rpc-attributes
         */
        "rpc.jsonrpc.version": jsonRPCRequest.jsonrpc,
      },
    },
    (span) => {
      span.addEvent("received", {
        "message.type": "RECEIVED",
        "message.id": messageCounter++,
      });

      if (
        typeof jsonRPCRequest.id !== "undefined" &&
        jsonRPCRequest.id !== null
      ) {
        span.setAttribute("rpc.jsonrpc.request_id", jsonRPCRequest.id);
      }

      // server.receive takes a JSON-RPC request and returns a promise of a JSON-RPC response.
      // It can also receive an array of requests, in which case it may return an array of responses.
      // Alternatively, you can use server.receiveJSON, which takes JSON string as is (in this case req.body).
      server.receive(jsonRPCRequest).then(
        (jsonRPCResponse) => {
          if (typeof jsonRPCResponse.error !== "undefined") {
            span.setStatus({
              code: SpanStatusCode.ERROR,
              message: jsonRPCResponse.error.message,
            });
          } else {
            span.setStatus({
              code: SpanStatusCode.OK,
            });
          }
          if (jsonRPCResponse) {
            res.json(jsonRPCResponse);
          } else {
            // If response is absent, it was a JSON-RPC notification method.
            // Respond with no content status (204).
            res.sendStatus(204);
          }

          span.end();
        },
        (error) => {
          span.end();

          return Promise.reject(error);
        }
      );
    }
  );
};

module.exports = { expressHandler };
