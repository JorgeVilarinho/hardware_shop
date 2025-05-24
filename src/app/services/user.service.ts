import { AuthenticationService } from './authentication.service';
import { LocalStorageService } from './local-storage.service';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Address } from '../models/address.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { StateService } from './state.service';
import { CartService } from './cart.service';
import { GetOrUpdateDataClient } from '../models/getOrUpdateDataClient';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  localStorageService = inject(LocalStorageService);
  stateService = inject(StateService);
  cartService = inject(CartService);
  authenticationService = inject(AuthenticationService);
  httpClient = inject(HttpClient);
  snackbar = inject(MatSnackBar);
  router = inject(Router);
  
  addedAddressSubject = new BehaviorSubject<Address | undefined>(undefined);
  initializeAddressesSubject = new BehaviorSubject<Address[] | undefined>(undefined);
  deletedAddressSubject = new BehaviorSubject<number | undefined>(undefined);
  getOrUpdateClientDataSubject = new BehaviorSubject<GetOrUpdateDataClient | undefined>(undefined);
  
  getOrUpdateClientData$ = this.getOrUpdateClientDataSubject.asObservable()

  constructor() { }

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

          this.authenticationService.loggedInUser!.name = name
          this.authenticationService.loggedInUser!.email = email
          this.authenticationService.loggedInUser!.dni = dni
          this.authenticationService.loggedInUser!.phone = phone
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
          this.authenticationService.loggedInUser!.password = newPassword;
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

  public async getAddresses(): Promise<Address[]> {
    const response = await firstValueFrom(
      this.httpClient.get<any>(`${environment.apiBaseUrl}users/addresses`, 
      { observe: 'response', withCredentials: true })
    );

    if(response.ok) return response.body.addresses;

    return []
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

  // private fillSessionCart
}
