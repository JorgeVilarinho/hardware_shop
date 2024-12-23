import { LocalStorageService } from './local-storage.service';
import { Injectable, inject } from '@angular/core';
import { Client } from '../models/client.model';
import { BehaviorSubject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Address } from '../models/address.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { StateService } from './state.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  snackbar = inject(MatSnackBar);
  router = inject(Router);
  localStorageService = inject(LocalStorageService);
  stateService = inject(StateService);
  httpClient = inject(HttpClient);

  loggedInUser: Client | undefined;
  userIsLoggedInSubject = new BehaviorSubject<boolean>(this.initializeLoggedInUser());
  addedAddressSubject = new BehaviorSubject<Address | undefined>(undefined);
  initializeAddressesSubject = new BehaviorSubject<Address[] | undefined>(undefined);
  deletedAddressSubject = new BehaviorSubject<number | undefined>(undefined);
  getOrUpdateClientDataSubject = new BehaviorSubject<Client | undefined>(undefined);
  
  client$ = this.getOrUpdateClientDataSubject.asObservable()

  constructor() { }

  // TODO: This method is not working
  private initializeLoggedInUser(): boolean {
    let isAuthenticated = false;

    this.httpClient.get<any>(`${environment.apiBaseUrl}auth/isAuthenticated`, 
      { observe: 'response', withCredentials: true }).subscribe(result => {
        if(result.ok) {
          isAuthenticated = true;
        } else {
          isAuthenticated = false;
        }
      }
    );

    return isAuthenticated;
  }

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
      
      this.snackbar.open(result.body.message, 'Ok', { duration: 3000 });
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
          this.snackbar.open('Se ha realizado el registro correctamente', 'Ok', { duration: 3000 });
          this.router.navigate(['/login']);
        } else {
          this.snackbar.open(result.body.message, "Ok", { duration: 3000 });
        }
      }
    );
  }

  public getUserData(): void {
    this.httpClient.get<any>(`${environment.apiBaseUrl}users/data`, 
      { observe: 'response', withCredentials: true })
      .subscribe(result => {
        if(result.ok) {
          this.getOrUpdateClientDataSubject.next({
            name: result.body.data.fullname,
            email: result.body.data.email,
            dni: result.body.data.dni,
            phone: result.body.data.phone
          })
        } else {
          this.snackbar.open(result.body.message, "Ok", { duration: 3000 });
        }
      }
    );
  }

  public changeUserData(name: string, dni: string, email: string, phone: string): void {
    this.httpClient.put<any>(`${environment.apiBaseUrl}users/data`, 
      {
        name,
        email,
        dni,
        phone
      },
      { observe: 'response', withCredentials: true }).
      subscribe(result => {
        if(result.ok) {
          this.getOrUpdateClientDataSubject.next({
            name,
            email,
            dni,
            phone
          });

          this.loggedInUser!.name = name
          this.loggedInUser!.email = email
          this.loggedInUser!.dni = dni
          this.loggedInUser!.phone = phone
        }

        this.snackbar.open(result.body.message, 'Ok', { duration: 3000 });
      }
    );
  }

  public changePassword(newPassword: string): void {
    this.httpClient.put<any>(`${environment.apiBaseUrl}users/password`,
      {
        password: newPassword
      },
      { observe: 'response', withCredentials: true })
      .subscribe(result => {
        if(result.ok) {
          this.loggedInUser!.password = newPassword;
        }

        this.snackbar.open(result.body.message, 'Ok', { duration: 3000 });
      }
    );
  }

  public initAddresses(): void {
    this.httpClient.get<any>(`${environment.apiBaseUrl}users/addresses`, 
      { observe: 'response', withCredentials: true })
      .subscribe(result => {
        if(result.ok) {
          this.initializeAddressesSubject.next(result.body.addresses)
        } else {
          this.snackbar.open(result.body.message, 'Ok', { duration: 3000 })
        }
      }
    );
  }

  public addAddress(name: string, address: string, cp: string, province: string, city: string, phone: string): void {
    this.httpClient.post<any>(`${environment.apiBaseUrl}users/address`,
      {
        name,
        address,
        cp,
        province,
        city,
        phone
      },
      { observe: 'response', withCredentials: true })
      .subscribe(result => {
        if(result.ok) {
          this.stateService.changeInitialAddressComponentToActive()
          this.addedAddressSubject.next({
            id: result.body.address.id,
            nombre: result.body.address.name,
            direccion: result.body.address.address,
            cod_postal: result.body.address.cp,
            provincia: result.body.address.province,
            ciudad: result.body.address.city,
            telefono: result.body.address.phone
          });
        }

        this.snackbar.open(result.body.message, 'Ok', { duration: 3000 })
      }
    );
  }

  public deleteAddress(id: number): void {
    this.httpClient.delete<any>(`${environment.apiBaseUrl}users/address/${id}`,
      { observe: 'response', withCredentials: true })
      .subscribe(result => {
        if(result.ok) {
          this.deletedAddressSubject.next(id);
        }

        this.snackbar.open(result.body.message, 'Ok', { duration: 3000 })
      });
  }
}
