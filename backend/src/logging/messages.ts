import { defineMessages } from "./restrictedMessages";

export const messages = defineMessages({
  info: {
    serverStarted(url: string) {
      return `🚀  Server ready at: ${url}`;
    },
    gRpcRequest(method: string, params: any) {
      return `[gRPC request] ${method}\n${JSON.stringify(params, null, 2)}`;
    },
    jsonRpcRequest(method: string, params: any) {
      return `[JSON-RPC request] ${method}\n${JSON.stringify(params, null, 2)}`;
    },
  },
});
