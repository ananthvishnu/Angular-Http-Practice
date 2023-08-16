import {
  HttpEventType,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { tap } from 'rxjs';

export class LoggingInterceptorService implements HttpInterceptor {
  //? This method intercepts HTTP requests and responses for logging purposes
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    //? Log information about the outgoing request
    console.log('Outgoing request');
    console.log(req.url); //? Log the URL of the request
    console.log(req.headers); //? Log the headers of the request

    //? Continue the request and intercept the response
    return next.handle(req).pipe(
      //? Use the 'tap' operator to log information when the response is received
      tap((event) => {
        if (event.type === HttpEventType.Response) {
          console.log('Incomming response');
          console.log(event.body); //? Log the body of the response
        }
      })
    );
  }
}
