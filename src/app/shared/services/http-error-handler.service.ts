import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
export type HandleError =
  <T> (operation?: string, result?: T) => (error: HttpErrorResponse) => Observable<T>;
@Injectable({
  providedIn: 'root'
})
export class HttpErrorHandler {

  constructor() { }

  /**
   * 创建错误请求处理事件
   * @memberof HttErrorHandler
   */
  createHandleError = (serviceName = ''): HandleError =>
    <T>(operation = 'operation', result = {} as T) => this.handlerError(serviceName, operation, result);

  /**
   * 统一错误请求处理
   * @param serviceName 服务名称
   * @param operation 请求方法
   * @param result 结果
   */
  handlerError<T>(serviceName = '', operation = 'operation', result = {} as T) {
    return (error: HttpErrorResponse): Observable<T> => {
      // TODO:可以将错误信息发送给后台
      // console.error(serviceName, error);
      const message = (error.error instanceof ErrorEvent) ?
        error.error.message : `error code ${error.status}，error message:"${error.error}"`;
      console.log(`${serviceName}: ${operation} 请求失败: ${message}`)
      return of(result);
    }
  }

}
