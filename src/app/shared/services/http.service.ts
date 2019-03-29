

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
@Injectable({ providedIn: 'root' })
export class HttpService {

  private http: HttpClient;
  constructor(injector: Injector) {
    this.http = injector.get(HttpClient);
  }
  private createHeaders(): HttpHeaders {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    return headers;
  }
  /**
   *
   * 发送get 请求
   * @memberof HttpService
   */
  get = <T>(url) => {
    return this.http.get<T>(url, { headers: this.createHeaders() })
  }
  /**
   * 发送post 请求
   * @memberof HttpService
   */
  post = <T>(url, data) => {
    return this.http.post<T>(url, data, { headers: this.createHeaders() })
  }
}
