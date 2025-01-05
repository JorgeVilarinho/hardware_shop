import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Client } from '../models/client.model';
import { BehaviorSubject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CartService } from './cart.service';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  httpClient = inject(HttpClient);
  cartService = inject(CartService);
  localStorageService = inject(LocalStorageService);
  router = inject(Router);
  snackBar = inject(MatSnackBar);

  loggedInUser: Client | undefined;
  userIsLoggedInSubject = new BehaviorSubject<boolean>(false);

  constructor() {}

  public logInUser(email: string, password: string): void {
      this.httpClient.post<any>(`${environment.apiBaseUrl}auth/login`, {
        email,
        password
      }, { observe: 'response', withCredentials: true }).
      subscribe(result => {
        if(result.ok) {
         let client: Client = {
           name:  result.body.userData.name,
           email: result.body.userData.email,
           dni: result.body.userData.dni,
           phone: result.body.userData.phone,
           password
         }
         
         this.loggedInUser = client;
         this.userIsLoggedInSubject.next(true);
  
         this.router.navigate(['/home']);
        }
        
        this.snackBar.open(result.body.message, 'Ok', { duration: 3000 });
     });
    }
  
    public logOutUser(): void {
      this.httpClient.post<any>(`${environment.apiBaseUrl}auth/logout`, 
        null,
        { observe: 'response', withCredentials: true }).
        subscribe(result => {
          if(result.ok) {
            this.loggedInUser = undefined;
            this.userIsLoggedInSubject.next(false);
            this.cartService.removeAllItems();
            this.localStorageService.removeItem('items');
          }
        }
      );
    }
  
    public registerUser(name: string, email: string, password: string): void {
      this.httpClient.post<any>(`${environment.apiBaseUrl}auth/register`, 
        {
          name,
          email, 
          password
        },
        { observe: 'response' }).
        subscribe(result => {
          if(result.ok) {
            this.snackBar.open('Se ha realizado el registro correctamente', 'Ok', { duration: 3000 });
            this.router.navigate(['/login']);
          } else {
            this.snackBar.open(result.body.message, "Ok", { duration: 3000 });
          }
        }
      );
    }

    public initializeLoggedInUser(): void {
      this.httpClient.get<any>(`${environment.apiBaseUrl}auth/isAuthenticated`, 
        { observe: 'response', withCredentials: true })
        .subscribe(result => {
          if(result.ok) {
            this.userIsLoggedInSubject.next(true);
          }
        }
      );
    }
}
