import type { StandaloneServerContextFunctionArgument } from "@apollo/server/dist/esm/standalone";
import jwt from "jsonwebtoken";
import JsonPlaceholderAPI from "./dataSources/JSONPlaceholderAPI";
import UserServiceRPC from "./dataSources/UserServiceRPC";
import PostServiceRPC from "./dataSources/PostServiceRPC";
import CommentServiceRPC from "./dataSources/CommentServiceRPC";

export const context = async ({
  req,
}: StandaloneServerContextFunctionArgument) => {
  const token = (req.headers["authorization"] ?? "").replace("Bearer ", "");

  let user = undefined;

  if (token) {
    try {
      user = jwt.verify(token, process.env.JWT_SECRET as string);
    } catch {
      user = undefined;
    }
  }

  return {
    user,
    dataSources: {
      jsonplaceholderAPI: new JsonPlaceholderAPI(),
      userServiceRpc: new UserServiceRPC(),
      postServiceRpc: new PostServiceRPC(),
      commentServiceRpc: new CommentServiceRPC(),
    },
  };
};

export type ContextValue = Awaited<ReturnType<typeof context>>;
