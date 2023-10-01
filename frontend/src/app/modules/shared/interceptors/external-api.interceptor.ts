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
    return next.handle(this.selectApi(request));
  }

  selectApi (request: HttpRequest<any>) {
    const splitCount1 = this.searchInUrl(request.url, 'api.unsplash.com')
    if (splitCount1) {
      return this.assignApiParams1(request, splitCount1)
    }
    const splitCount2 = this.searchInUrl(request.url, 'api.apilayer.com')
    if (splitCount2) {
      return this.assignApiParams2(request, splitCount2)
    }
    const splitCount3 = this.searchInUrl(request.url, 'i18n') // use for load local json then
    if (splitCount3) {
      return this.assignApiParams3(request)
    }
    return request
  }

  searchInUrl (url: string, searchStr: string): number {
    let splitCount: number = 0
    url.split('/').forEach((urlPart: string, i: number) => {
      if (urlPart === searchStr) {
        splitCount = i
      }
    })
    return splitCount
  }

  assignApiParams1(request: HttpRequest<any>, splitCount: number): HttpRequest<any>{
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

  assignApiParams2(request: HttpRequest<any>, splitCount: number): HttpRequest<any>{
    let urlArr = request.url.split('/')
    urlArr.splice(0, splitCount)
    const clone = request.clone({
      url: 'https://' + urlArr.join('/'),
      headers: request.headers.delete('Authorization').delete('Access-Control-Allow-Headers'),
      setHeaders: {
        'Content-Type': 'application/javascript',
        'Accept': 'application/javascript',
        'apikey': 'fXQVlAfPuL3j85v8lEnQ1JsGqgVxR2Wm',
      },
    })
    return clone
  }

  assignApiParams3(request: HttpRequest<any>): HttpRequest<any>{
    let urlArr = request.url.split('/')
    urlArr.splice(0, 4)
    const clone = request.clone({
      url: '/' + urlArr.join('/'),
      headers: request.headers.delete('Authorization').delete('Access-Control-Allow-Headers'),
      setHeaders: {
        'Content-Type': 'application/javascript',
        'Accept': 'application/javascript',
        'apikey': 'fXQVlAfPuL3j85v8lEnQ1JsGqgVxR2Wm',
      },
    })
    return clone
  }
}
