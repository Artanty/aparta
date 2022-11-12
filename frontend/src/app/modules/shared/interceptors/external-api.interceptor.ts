import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class ExternalApiInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(this.assignApiParams(request));
  }
  assignApiParams(request: HttpRequest<any>){

    let splitCount: number = 0
    request.url.split('/').forEach((urlPart: string, i: number) => {
      if (urlPart === 'api.unsplash.com') {
        splitCount = i
      }
    })
    if (splitCount) {
      let urlArr = request.url.split('/')
      urlArr.splice(0, splitCount)

      return request.clone({
        url: 'https://' + urlArr.join('/'),
        setHeaders: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Authorization': 'Client-ID XvC-s9gZjz60RgQaVityL4F0Hpaamlg71E66zM8eERs'
        }
      })
    }
    return request
  }
}
