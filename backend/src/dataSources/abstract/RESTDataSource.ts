import {
  CacheOptions,
  RESTDataSource as IntrinsicRESTDataSource,
  RequestOptions,
} from "@apollo/datasource-rest";

export abstract class RESTDataSource extends IntrinsicRESTDataSource {
  protected override didEncounterError(
    _error: Error,
    _request: RequestOptions<CacheOptions>,
    _url?: URL | undefined
  ): void {
    this.logger.error(_error);

    super.didEncounterError(_error, _request, _url);
  }
}
