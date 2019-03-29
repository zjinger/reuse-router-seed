import { BaseService } from './base.service';
import { HttpService } from 'src/app/shared/services/http.service';
import { HttpErrorHandler } from './http-error-handler.service';
let baseServiceFactory = (http: HttpService, httpErrorHandler: HttpErrorHandler) => {
  return new BaseService(http, httpErrorHandler);
};
export let baseServiceProvider =
{
  provide: BaseService,
  useFactory: baseServiceFactory,
  deps: [HttpService, HttpErrorHandler]
};
