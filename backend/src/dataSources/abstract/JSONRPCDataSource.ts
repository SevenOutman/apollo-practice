import {
  JSONRPCClient,
  type TypedJSONRPCClient,
  type JSONRPCResponse,
} from "json-rpc-2.0";
import axios from "axios";
import { logger, messages } from "../../logging";

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
    (jsonRPCRequest) =>
      axios
        .post<JSONRPCResponse>(this.baseURL, jsonRPCRequest)
        .then((response) => {
          if (response.status === 200) {
            return this.client.receive(response.data);
          } else if (jsonRPCRequest.id !== undefined) {
            return Promise.reject(new Error(response.statusText));
          }
        })
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
    logger.error(error);
  }
}
