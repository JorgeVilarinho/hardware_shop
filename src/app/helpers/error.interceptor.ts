import { HttpClient, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { catchError } from "rxjs";
import { LogoutService } from "../services/logout.service";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    logOutService = inject(LogoutService)
    httpClient = inject(HttpClient)
  
    constructor() {}

    intercept(request: HttpRequest<any>, next: HttpHandler) {
      return next.handle(request).pipe(catchError(err => {
        if ([403].includes(err.status)) {
          this.logOutService.logOut();
        }

        throw err;
      }))
    }
}