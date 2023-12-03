import { logger } from "../../logging";

/**
 * TODO: Implement caching
 */
export abstract class GRPCDataSource<
  Methods extends Record<string, (params?: any) => any>,
> {
  protected abstract client: any;

  protected async request<Method extends Extract<keyof Methods, string>>(
    method: Method,
    params?: Parameters<Methods[Method]>[0]
  ) {
    try {
      logger.info(`requesting ${method}`, params);
      return await new Promise((resolve, reject) => {
        this.client[method](params, function (err: Error, response: any) {
          if (err) {
            logger.error(err);
            reject(err);
          } else {
            resolve(response);
          }
        });
      });
    } catch (error) {
      this.didEncounterError(error as Error);
      throw error;
    }
  }

  protected didEncounterError(error: Error) {
    logger.error(error);
  }
}
