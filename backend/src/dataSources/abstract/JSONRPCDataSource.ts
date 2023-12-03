import {
  JSONRPCClient,
  type JSONRPCRequest,
  type JSONRPCResponse,
  type TypedJSONRPCClient,
} from "json-rpc-2.0";
import axios from "axios";
import { SpanKind, SpanStatusCode, trace } from "@opentelemetry/api";
import { logger, messages } from "../../logging";

const tracer = trace.getTracer("default");

let messageCounter = 1;

/**
 * TODO: Implement caching
 */
export abstract class JSONRPCDataSource<
  Methods extends Record<string, (params?: any) => any>,
> {
  /**
   * For telemetry use
   */
  protected abstract serviceName: string;
  protected abstract baseURL: string;

  // JSONRPCClient needs to know how to send a JSON-RPC request.
  // Tell it by passing a function to its constructor. The function must take a JSON-RPC request and send it.
  protected client: TypedJSONRPCClient<Methods> = new JSONRPCClient(
    (jsonRPCRequest: JSONRPCRequest) => {
      return tracer.startActiveSpan(
        /**
         * @see https://opentelemetry.io/docs/specs/semconv/rpc/rpc-spans/#span-name
         */
        this.serviceName + "/" + jsonRPCRequest.method,
        {
          kind: SpanKind.CLIENT,
          attributes: {
            /**
             * RPC Common Attributes
             * @see https://opentelemetry.io/docs/specs/semconv/rpc/rpc-spans/#common-attributes
             */
            "server.address": new URL(this.baseURL).host,
            "rpc.system": "jsonrpc",
            "rpc.service": this.serviceName,
            "rpc.method": jsonRPCRequest.method,
            /**
             * JSON RPC Attributes
             * @see https://opentelemetry.io/docs/specs/semconv/rpc/json-rpc/#json-rpc-attributes
             */
            "rpc.jsonrpc.version": jsonRPCRequest.jsonrpc,
          },
        },
        (span) => {
          if (
            typeof jsonRPCRequest.id !== "undefined" &&
            jsonRPCRequest.id !== null
          ) {
            span.setAttribute("rpc.jsonrpc.request_id", jsonRPCRequest.id);
          }

          span.addEvent("request", {
            "message.type": "SENT",
            "message.id": messageCounter++,
          });

          return axios
            .post<JSONRPCResponse>(this.baseURL, jsonRPCRequest)
            .then(
              (response) => {
                if (response.status === 200) {
                  // Use client.receive when you received a JSON-RPC response.
                  // TODO: handle mal-formatted response
                  if (typeof response.data.error !== "undefined") {
                    span.setStatus({
                      code: SpanStatusCode.ERROR,
                      message: response.data.error.message,
                    });
                    span.setAttribute(
                      "rpc.jsonrpc.error_code",
                      JSON.stringify(response.data.error.code)
                    );
                    span.setAttribute(
                      "rpc.jsonrpc.error_message",
                      JSON.stringify(response.data.error.message)
                    );
                  } else {
                    span.setStatus({
                      code: SpanStatusCode.OK,
                    });
                  }
                  return this.client.receive(response.data);
                } else if (jsonRPCRequest.id !== undefined) {
                  return Promise.reject(new Error(response.statusText));
                }
              },
              (error) => {
                span.setStatus({
                  code: SpanStatusCode.ERROR,
                  message: error.message,
                });
              }
            )
            .finally(() => {
              span.end();
            });
        }
      );
    }
  );

  protected async request<Method extends Extract<keyof Methods, string>>(
    method: Method,
    params?: Parameters<Methods[Method]>[0]
  ) {
    try {
      logger.info(
        messages.info.jsonRpcRequest(this.serviceName + "/" + method, params)
      );
      return await this.client.request(method, params, void 0);
    } catch (error) {
      this.didEncounterError(error as Error);
      throw error;
    }
  }

  protected didEncounterError(error: Error) {
    logger.debug(error);
    logger.error(error);
  }
}
