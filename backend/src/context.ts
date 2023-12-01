import JsonPlaceholderAPI from "./dataSources/JSONPlaceholderAPI";
import UserServiceRPC from "./dataSources/UserServiceRPC";

export const context = async () => {
  return {
    dataSources: {
      jsonplaceholderAPI: new JsonPlaceholderAPI(),
      userServiceRpc: new UserServiceRPC(),
    },
  };
};

export type ContextValue = Awaited<ReturnType<typeof context>>;
