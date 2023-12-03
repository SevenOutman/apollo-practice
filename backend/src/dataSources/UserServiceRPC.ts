import { z } from "zod";
import { JSONRPCDataSource } from "./abstract/JSONRPCDataSource";
import { User } from "../__generated__/resolvers-types";

const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  username: z.string(),
  email: z.string(),
  address: z.object({
    street: z.string(),
    suite: z.string(),
    city: z.string(),
    zipcode: z.string(),
    geo: z.object({ lat: z.string(), lng: z.string() }),
  }),
  phone: z.string(),
  website: z.string(),
  company: z.object({
    name: z.string(),
    catchPhrase: z.string(),
    bs: z.string(),
  }),
});

type Methods = {
  listUsers(): User[];
  getUserById(id: number): User;
};

export default class UserServiceRPC extends JSONRPCDataSource<Methods> {
  protected override serviceName = "UserService";
  protected override baseURL = "http://localhost:4001/json-rpc";

  async listUsers() {
    return this.request("listUsers").then((data) =>
      UserSchema.array().parse(data)
    );
  }

  async getUser(id: number) {
    return this.request("getUserById", id).then((data) =>
      UserSchema.parse(data)
    );
  }
}
