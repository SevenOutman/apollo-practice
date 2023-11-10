import { RESTDataSource } from "@apollo/datasource-rest";
import { z } from "zod";

const UserSchema = z.object({
  id: z.number().transform((val) => val.toString()),
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

class JsonPlaceholderAPI extends RESTDataSource {
  override baseURL = "https://jsonplaceholder.typicode.com";

  async listUsers() {
    return this.get("/users").then((data) => UserSchema.array().parse(data));
  }

  async getUser(id: string) {
    return this.get(`/users/${id}`).then((data) => UserSchema.parse(data));
  }
}

export default JsonPlaceholderAPI;
