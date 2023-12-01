import JsonPlaceholderAPI from "./dataSources/JSONPlaceholderAPI";
import UserServiceRPC from "./dataSources/UserServiceRPC";
import CommentServiceRPC from "./dataSources/CommentServiceRPC";

export const context = async () => {
  return {
    dataSources: {
      jsonplaceholderAPI: new JsonPlaceholderAPI(),
      userServiceRpc: new UserServiceRPC(),
      commentServiceRpc: new CommentServiceRPC(),
    },
  };
};

export type ContextValue = Awaited<ReturnType<typeof context>>;
