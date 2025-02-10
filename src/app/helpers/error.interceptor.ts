import { AuthenticationService } from './../services/authentication.service';
import { HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { catchError } from "rxjs";
import { LogoutService } from "../services/logout.service";
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    logOutService = inject(LogoutService)
    authenticationService = inject(AuthenticationService)
    snackBar = inject(MatSnackBar)
    router = inject(Router)
  
    constructor() {}

    intercept(request: HttpRequest<any>, next: HttpHandler) {
      return next.handle(request).pipe(catchError(err => {
        if([400].includes(err.status)) {
          const httpErrorResponse = err as HttpErrorResponse

          this.snackBar.open(httpErrorResponse.error.message, 'Ok', { duration: 3000 })
        }

        if([401].includes(err.status)) {
          this.authenticationService.userIsLoggedInSubject.next(false)
        }

        if ([403].includes(err.status) && !request.url.includes('shopping-basket')) {
          this.logOutService.logOut();
          this.router.navigate(['/home'])
        }

        throw err;
      }))
    }
}