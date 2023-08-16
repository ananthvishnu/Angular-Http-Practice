import {
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';

export class AuthInterceptorService implements HttpInterceptor {
    //? This method intercepts HTTP requests and adds authentication headers
  intercept(req: HttpRequest<any>, next: HttpHandler) {
     //? Clone the original request and modify it
    const modifiedRequest = req.clone({
      headers: req.headers.append('Auth', 'xyz'),//? Append 'Auth' header with 'xyz' token
    });
     //? Continue handling the modified request in the request pipeline
    return next.handle(modifiedRequest).pipe();
  }
}
