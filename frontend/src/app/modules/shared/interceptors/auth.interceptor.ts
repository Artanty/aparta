import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { BehaviorSubject, filter, finalize, Observable, switchMap, take, takeUntil, skipWhile, exhaustMap, tap } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  isLoadingUser: boolean = false
  constructor(
    private AuthServ: AuthService
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(this.addAuthToken(request)).pipe(
      tap(() => {
        if (request.url !== 'getUser') {
          const user = this.AuthServ.getUser()
          if (!user && !this.isLoadingUser) {
            this.isLoadingUser = true
            this.AuthServ.loadUser().pipe(
              take(1),
              finalize(() => {
                this.isLoadingUser = false
              })
            ).subscribe()
          }
        }
      })
    )
  }

  addAuthToken(request: HttpRequest<any>): HttpRequest<any> {
    const token = this.AuthServ.getToken()
    return request.clone({
      setHeaders: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Authorization': `Bearer ${token}`
      }
    })
  }

}
