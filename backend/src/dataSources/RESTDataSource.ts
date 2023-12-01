import { RESTDataSource as IntrinsicRESTDataSource } from "@apollo/datasource-rest";
import { logger } from "../logger";

export abstract class RESTDataSource extends IntrinsicRESTDataSource {
  override logger = logger;
}
