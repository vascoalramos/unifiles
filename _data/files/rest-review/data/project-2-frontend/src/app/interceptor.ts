import {Injectable} from '@angular/core';

import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';

import {Observable} from 'rxjs';

@Injectable()
export class Interceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Clone the request to add the new header
    if (localStorage.hasOwnProperty('token') && localStorage.getItem('token') !== 'null') {
      const clonedRequest = req.clone({headers: req.headers.set('Authorization', 'Token ' + localStorage.getItem('token'))});
      // Pass the cloned request instead of the original request to the next handle
      return next.handle(clonedRequest);
    }
    return next.handle(req);
  }
}
