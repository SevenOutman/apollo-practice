import {
  JSONRPCClient,
  type JSONRPCResponse,
  type TypedJSONRPCClient,
} from "json-rpc-2.0";
import { logger } from "../../logger";

/**
 * TODO: Implement caching
 */
export abstract class JSONRPCDataSource<
  Methods extends Record<string, (params?: any) => any>,
> {
  protected abstract baseURL: string;

  // JSONRPCClient needs to know how to send a JSON-RPC request.
  // Tell it by passing a function to its constructor. The function must take a JSON-RPC request and send it.
  protected client: TypedJSONRPCClient<Methods> = new JSONRPCClient(
    (jsonRPCRequest) =>
      fetch(this.baseURL, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(jsonRPCRequest),
      }).then((response) => {
        if (response.status === 200) {
          // Use client.receive when you received a JSON-RPC response.
          return response.json().then((jsonRPCResponse) =>
            // TODO: handle mal-formatted response
            this.client.receive(jsonRPCResponse as JSONRPCResponse),
          );
        } else if (jsonRPCRequest.id !== undefined) {
          return Promise.reject(new Error(response.statusText));
        }
      }),
  );

  protected async request<Method extends Extract<keyof Methods, string>>(
    method: Method,
    params?: Parameters<Methods[Method]>[0],
  ) {
    try {
      logger.info(`requesting ${method}`, params);
      return await this.client.request(method, params, void 0);
    } catch (error) {
      this.didEncounterError(error as Error);
      throw error;
    }
  }

  protected didEncounterError(error: Error) {
    logger.error(error);
  }
}
