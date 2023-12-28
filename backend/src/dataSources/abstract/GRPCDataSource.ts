import { disposables } from "../../disposable";
import { logger, messages } from "../../logging";

/**
 * TODO: Implement caching
 */
export abstract class GRPCDataSource<
  Methods extends Record<string, (params?: any) => any>,
> implements Disposable
{
  protected abstract serviceName: string;
  protected abstract client: any;

  constructor() {
    disposables.add(this);
  }

  abstract [Symbol.dispose](): void;

  protected async request<Method extends Extract<keyof Methods, string>>(
    method: Method,
    params?: Parameters<Methods[Method]>[0]
  ) {
    try {
      logger.info(
        messages.info.gRpcRequest(this.serviceName + "/" + method, params)
      );
      return await new Promise<ReturnType<Methods[Method]>>(
        (resolve, reject) => {
          this.client[method](params, function (err: Error, response: any) {
            if (err) {
              logger.error(err);
              reject(err);
            } else {
              resolve(response);
            }
          });
        }
      );
    } catch (error) {
      this.didEncounterError(error as Error);
      throw error;
    }
  }

  protected didEncounterError(error: Error) {
    logger.error(error);
  }
}
