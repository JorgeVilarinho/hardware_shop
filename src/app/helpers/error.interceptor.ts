import { AuthenticationService } from './../services/authentication.service';
import { HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { catchError } from "rxjs";
import { LogoutService } from "../services/logout.service";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    logOutService = inject(LogoutService)
    authenticationService = inject(AuthenticationService)
  
    constructor() {}

    intercept(request: HttpRequest<any>, next: HttpHandler) {
      return next.handle(request).pipe(catchError(err => {
        if([401].includes(err.status)) {
          this.authenticationService.userIsLoggedInSubject.next(false)
        }

        if ([403].includes(err.status) && !request.url.includes('shopping-basket')) {
          this.logOutService.logOut();
        }

        throw err;
      }))
    }
}