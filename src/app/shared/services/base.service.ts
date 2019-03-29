import { HttpService } from 'src/app/shared/services/http.service';
import { Injectable, Injector, Input } from '@angular/core';
import { Result } from '../models/result.model';
import { HttpErrorHandler, HandleError } from '.';
import { catchError } from 'rxjs/operators';
/**
 * 基类 service 的封装
 * 其他 service可以注入 BaseService 作为基类，自带CURD 操作
 * getList ,getInfo, delete,save等CURD操作 根据后台进行相应的封装
 * 同时暴露出 httpGet与 httpPost 请求，可以在其他service 进行扩展
 */
@Injectable({ providedIn: 'root' })
export class BaseService {
  private baseUrl: string;
  private handleError: HandleError;
  private serviceName: string = '';
  constructor(
    private http: HttpService,
    private httpErrorHandler: HttpErrorHandler
  ) {
  }
  set(baseUrl: string, serviceName: string) {
    this.baseUrl = baseUrl;
    this.serviceName = serviceName;
    this.handleError = this.httpErrorHandler.createHandleError(this.serviceName);
  }
  /**
   * 请求列表数据
   *
   * @memberof BaseService
   */
  getList = (data): Promise<{}> => {
    return this.httpPost(`${this.baseUrl}/getList`, data, 'getList');
  }

  /**
   *
   * 根据id 请求详细
   * @memberof BaseService
   */
  getInfo = (id: string): Promise<{}> => {
    return this.httpGet(`${this.baseUrl}/getInfo/${id}`, 'getInfo');
  }

  /**
   * 根据id 进行删除
   *
   * @memberof BaseService
   */
  delete = (id: string): Promise<{}> => {
    return this.httpGet(`${this.baseUrl}/delete/${id}`, 'delete');
  }
  /**
   * 保存
   *
   * @memberof BaseService
   */
  save = (data: string): Promise<{}> => {
    return this.httpPost(` ${this.baseUrl}/save`, data, 'save');
  }

  /**
   * 发送http post 请求
   * @param url 请求路径
   * @param data 请求实体
   * @param operation 进行的操作请求
   * @memberof BaseService
   */
  httpPost = <Result>(url, data, operation = 'httpPost'): Promise<any> => {
    return new Promise((resolve, reject?) => {
      this.http.post<Result>(`${url}`, data).pipe(
        catchError(this.handleError(operation))
      ).subscribe((res: Result) => {
        this.successResponseCb(res, resolve, reject)
      }, error => {
        this.failResponseCb(error, resolve);
      })
    })
  }

  /**
   * 发送http get 请求
   *
   * @param url 请求路径
   * @param operation 进行的操作请求 default：httpGet
   * @memberof BaseService
   */
  httpGet = <Resutl>(url, operation = "httpGet"): Promise<{}> => {
    return new Promise((resolve, reject) => {
      this.http.get<Resutl>(`${url}`).pipe(
        catchError(this.handleError(operation))
      ).subscribe((res: Result) => {
        this.successResponseCb(res, resolve, reject)
      }, error => {
        this.failResponseCb(error, reject);
      })
    })
  }

  /**
   * 请求响应成功的回调函数，有响应实体数据res
   * 根据响应实体数据判断是否返回正确数据
   * @private
   * @memberof BaseService
   */
  private successResponseCb = (res: Result, cb, errCb?) => {
    if (res.rlt == 0) {
      cb(res.datas);
    } else {
      let info = res && res.info ? res.info : '接口调用失败';
      let msg = res && res.datas ? res.datas : '';
      if (errCb) errCb(`${info}:${msg}`);
    }
  }

  /**
   * 响应失败时的回调，没有响应实体数据
   * 500,504,401,403等等
   * @private
   * @memberof BaseService
   */
  private failResponseCb = (error, errCb?) => {
    if (errCb) errCb(error)
  }
}
