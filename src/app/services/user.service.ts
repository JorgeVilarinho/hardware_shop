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
  userIsLoggedIn = new BehaviorSubject<boolean>(this.initializeLoggedInUser());
  addedAddress = new BehaviorSubject<Address | undefined>(undefined);
  initializeAddresses = new BehaviorSubject<Address[] | undefined>(undefined);
  deletedAddress = new BehaviorSubject<number | undefined>(undefined);

  getNameFromLoggedInUser(): string {
    return this.loggedInUser?.name ?? '';
  }

  getDniFromLoggedInUser(): string {
    return this.loggedInUser?.dni ?? '';
  }

  getEmailFromLoggedInUser(): string {
    return this.loggedInUser?.email ?? '';
  }

  getPhoneFromLoggedInUser(): string {
    return this.loggedInUser?.phone ?? '';
  }

  initializeLoggedInUser(): boolean {
    // let value = this.localStorageService.getItem("user");

    // if(value) {
    //   let user: Client = JSON.parse(value);
    //   return user;
    // }

    // return null;
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

  logInUser(email: string, password: string): void {
    this.httpClient.post<any>(`${environment.apiBaseUrl}auth/login`, {
      email,
      password
    }, { observe: 'response', withCredentials: true }).
    subscribe(result => {
      if(result.ok) {
       this.snackbar.open(result.body.message, 'Ok', { duration: 3000 });
       let client: Client = {
         name:  result.body.userData.name,
         email: result.body.userData.email,
         dni: result.body.userData.dni,
         phone: result.body.userData.phone
       }
       
       this.loggedInUser = client;
       this.userIsLoggedIn.next(true);

       this.router.navigate(['/home']);
      } else {
       this.snackbar.open(result.body.message, 'Ok', { duration: 3000 });
      }
   });
  }

  public logOutUser(): void {
    this.httpClient.post<any>(`${environment.apiBaseUrl}auth/logout`, 
      null,
      { observe: 'response', withCredentials: true }).
      subscribe(result => {
        if(result.ok) {
          this.loggedInUser = undefined;
          this.userIsLoggedIn.next(false);
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
        this.snackbar.open(result.body.message, 'Ok', { duration: 3000 });
      }
    );
  }

  public initAddresses(): void {
    this.httpClient.get<any>(`${environment.apiBaseUrl}users/addresses`, 
      { observe: 'response', withCredentials: true })
      .subscribe(result => {
        if(result.ok) {
          this.initializeAddresses.next(result.body.addresses)
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
          this.addedAddress.next({
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
          this.deletedAddress.next(id);
        }

        this.snackbar.open(result.body.message, 'Ok', { duration: 3000 })
      });
  }

  constructor() { }
}
