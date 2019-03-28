import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, finalize } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements HttpInterceptor {

  // constructor(private messager: MessageService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const started = Date.now();
    let ok: string;
    return next.handle(req)
      .pipe(
        tap(
          // 有响应时成功，忽略其他的事件
          event => ok = event instanceof HttpResponse ? 'succeeded' : '',
          // 操作失败; 返回 HttpErrorResponse对象
          error => ok = 'failed'
        ),
        // 记录响应完成时的日志
        finalize(() => {
          const elapsed = Date.now() - started;
          const msg = `${req.method} '${req.urlWithParams}' ${ok} in ${elapsed} ms.`;
          // this.messager.add(msg);
          console.log(msg);
        })
      )
  }
}
