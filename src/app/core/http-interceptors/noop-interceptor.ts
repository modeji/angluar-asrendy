import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest
} from '@angular/common/http';

import { Observable } from 'rxjs';

/** Pass untouched request through to the next request handler. */
@Injectable()
export class NoopInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>> {
    return next.handle(req);
  }
}

// https://angular.io/guide/http#intercepting-requests-and-responses

/*

import { HTTP_INTERCEPTORS } from '@angular/common/http';

{ provide: HTTP_INTERCEPTORS, useClass: NoopInterceptor, multi: true }

*/
