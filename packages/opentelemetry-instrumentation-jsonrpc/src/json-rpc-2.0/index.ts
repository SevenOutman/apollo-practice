import {
  context,
  propagation,
  ROOT_CONTEXT,
  SpanOptions,
  SpanKind,
  trace,
  Span,
  SpanStatusCode,
} from "@opentelemetry/api";
import {
  InstrumentationNodeModuleDefinition,
  isWrapped,
  InstrumentationBase,
} from "@opentelemetry/instrumentation";
import {
  MessageTypeValues,
  SemanticAttributes,
} from "@opentelemetry/semantic-conventions";

import * as jsonrpc from "json-rpc-2.0";

/**
 * Instrumentation for `json-rpc-2.0` package
 */
export class JsonRpc2Instrumentation extends InstrumentationBase {
  constructor() {
    super("opentelemetry-instrumentation-json-rpc-2.0", "*");
  }

  init() {
    return [
      new InstrumentationNodeModuleDefinition<typeof jsonrpc>(
        "json-rpc-2.0",
        ["1.*"],
        (moduleExports, version) => {
          this._diag.debug(`Applying patch for json-rpc-2.0@${version}`);

          // Patch Server methods

          if (isWrapped(moduleExports.JSONRPCServer.prototype.receive)) {
            this._unwrap(moduleExports.JSONRPCServer.prototype, "receive");
          }

          this._wrap(
            moduleExports.JSONRPCServer.prototype,
            "receive",
            (original) => {
              const tracer = this.tracer;
              let messageCounter = 1;
              return function receive(
                this: jsonrpc.JSONRPCServer,
                request: jsonrpc.JSONRPCRequest | jsonrpc.JSONRPCRequest[],
                serverParams?: any
              ) {
                return tracer.startActiveSpan(
                  "jsonrpc.<anonymous>/" +
                    (request as jsonrpc.JSONRPCRequest).method,
                  {
                    kind: SpanKind.SERVER,
                    attributes: {
                      /**
                       * RPC Common Attributes
                       * @see https://opentelemetry.io/docs/specs/semconv/rpc/rpc-spans/#common-attributes
                       */
                      // "server.address": req.socket.localAddress,
                      // "server.port": req.socket.localPort,
                      [SemanticAttributes.RPC_SYSTEM]: "jsonrpc",
                      [SemanticAttributes.RPC_SERVICE]: "<anonymous>",
                      [SemanticAttributes.RPC_METHOD]: (
                        request as jsonrpc.JSONRPCRequest
                      ).method,

                      /**
                       * RPC Server Attributes
                       */
                      // "client.address":
                      //   req.headers["x-forwarded-for"] ||
                      //   req.socket.remoteAddress,
                      // "client.port": req.socket.remotePort,

                      /**
                       * JSON RPC Attributes
                       * @see https://opentelemetry.io/docs/specs/semconv/rpc/json-rpc/#json-rpc-attributes
                       */
                      [SemanticAttributes.RPC_JSONRPC_VERSION]: (
                        request as jsonrpc.JSONRPCRequest
                      ).jsonrpc,
                      [SemanticAttributes.RPC_JSONRPC_REQUEST_ID]:
                        (request as jsonrpc.JSONRPCRequest).id ?? undefined,
                    },
                  },
                  (span) => {
                    span.addEvent("received", {
                      [SemanticAttributes.MESSAGE_TYPE]:
                        MessageTypeValues.RECEIVED,
                      [SemanticAttributes.MESSAGE_ID]: messageCounter++,
                    });

                    // server.receive takes a JSON-RPC request and returns a promise of a JSON-RPC response.
                    // It can also receive an array of requests, in which case it may return an array of responses.
                    // Alternatively, you can use server.receiveJSON, which takes JSON string as is (in this case req.body).
                    return original.call(this, request, serverParams).then(
                      (jsonRPCResponse) => {
                        if (
                          typeof (jsonRPCResponse as jsonrpc.JSONRPCResponse)
                            .error !== "undefined"
                        ) {
                          span.setStatus({
                            code: SpanStatusCode.ERROR,
                            message: (
                              jsonRPCResponse as jsonrpc.JSONRPCResponse
                            ).error!.message,
                          });
                        } else {
                          span.setStatus({
                            code: SpanStatusCode.OK,
                          });
                        }

                        span.end();

                        return jsonRPCResponse;
                      },
                      (error) => {
                        span.end();

                        return Promise.reject(error);
                      }
                    );
                  }
                );
              } as typeof moduleExports.JSONRPCServer.prototype.receive;
            }
          );

          // Patch Client methods
          if (
            isWrapped(moduleExports.JSONRPCClient.prototype["requestWithID"])
          ) {
            this._unwrap(
              moduleExports.JSONRPCClient.prototype,
              "requestWithID" as keyof typeof moduleExports.JSONRPCClient.prototype
            );
          }
          this._wrap(
            moduleExports.JSONRPCClient.prototype,
            "requestWithID" as keyof typeof moduleExports.JSONRPCClient.prototype,
            (original) => {
              const tracer = this.tracer;
              let messageCounter = 1;

              return function requestWithID(
                this: jsonrpc.JSONRPCClient,
                method: string,
                params: jsonrpc.JSONRPCParams | undefined,
                clientParams: any,
                id: jsonrpc.JSONRPCID
              ) {
                return tracer.startActiveSpan(
                  /**
                   * @see https://opentelemetry.io/docs/specs/semconv/rpc/rpc-spans/#span-name
                   */
                  "jsonrpc.<anonymous>/" + method,
                  {
                    kind: SpanKind.CLIENT,
                    attributes: {
                      /**
                       * RPC Common Attributes
                       * @see https://opentelemetry.io/docs/specs/semconv/rpc/rpc-spans/#common-attributes
                       */
                      // "server.address": new URL(this.baseURL).host,
                      [SemanticAttributes.RPC_SYSTEM]: "jsonrpc",
                      [SemanticAttributes.RPC_SERVICE]: "<anonymous>", // this.serviceName,
                      [SemanticAttributes.RPC_METHOD]: method,
                      /**
                       * JSON RPC Attributes
                       * @see https://opentelemetry.io/docs/specs/semconv/rpc/json-rpc/#json-rpc-attributes
                       */
                      [SemanticAttributes.RPC_JSONRPC_VERSION]: "2.0",
                      [SemanticAttributes.RPC_JSONRPC_REQUEST_ID]:
                        id ?? undefined,
                    },
                  },
                  (span) => {
                    span.addEvent("request", {
                      [SemanticAttributes.MESSAGE_TYPE]: MessageTypeValues.SENT,
                      [SemanticAttributes.MESSAGE_ID]: messageCounter++,
                    });

                    return (
                      original as (...args: unknown[]) => Promise<unknown>
                    )
                      .call(this, method, params, clientParams, id)
                      .then(
                        (result) => {
                          span.setStatus({
                            code: SpanStatusCode.OK,
                          });
                          return result;
                        },
                        (error: jsonrpc.JSONRPCErrorException) => {
                          span.setStatus({
                            code: SpanStatusCode.ERROR,
                            message: error.message,
                          });
                          span.setAttribute(
                            "rpc.jsonrpc.error_code",
                            JSON.stringify(error.code)
                          );
                          span.setAttribute(
                            "rpc.jsonrpc.error_message",
                            JSON.stringify(error.message)
                          );

                          return Promise.reject(error);
                        }
                      )
                      .finally(() => {
                        span.end();
                      });
                  }
                );
              } as (typeof jsonrpc.JSONRPCClient.prototype)["requestWithID"];
            }
          );
          return moduleExports;
        },
        (moduleExports, version) => {
          if (moduleExports === undefined) return;
          this._diag.debug(`Removing patch for json-rpc-2.0@${version}`);

          this._unwrap(moduleExports.JSONRPCServer.prototype, "receive");
          this._unwrap(
            moduleExports.JSONRPCClient.prototype,
            "requestWithID" as keyof typeof moduleExports.JSONRPCClient.prototype
          );
        }
      ),
    ];
  }
}
