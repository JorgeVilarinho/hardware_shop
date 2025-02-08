import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Client } from '../models/client.model';
import { BehaviorSubject, firstValueFrom, Subject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { LocalStorageService } from './local-storage.service';
import { LogInUserResponse } from '../responses/logInUser.response';
import { UserType } from '../models/userType';
import { User } from '../models/user.model';
import { Employee } from '../models/employee.model';
import { isAuthenticatedResponse } from '../responses/isAuthenticated.response';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  httpClient = inject(HttpClient);
  localStorageService = inject(LocalStorageService);
  router = inject(Router);
  snackBar = inject(MatSnackBar);

  loggedInUser: User | undefined;
  userIsLoggedInSubject = new BehaviorSubject<boolean>(false);
  logOutEvent = new Subject();

  constructor() {}

  public async logInUser(email: string, password: string): Promise<void> {
    const response = await firstValueFrom(
      this.httpClient.post<LogInUserResponse>(
        `${environment.apiBaseUrl}auth/login`,
        {
          email,
          password,
        },
        { observe: 'response', withCredentials: true }
      )
    );

    if (response.ok) {
      let user: User;

      if (response.body?.userType == UserType.CLIENT) {
        user = {
          user_id: response.body!.user_id,
          kind: response.body!.kind,
          name: response.body!.name,
          email: response.body!.email,
          dni: response.body!.dni,
          phone: response.body!.phone,
          password,
        } as Client;
      } else {
        user = {
          user_id: response.body!.user_id,
          kind: response.body!.kind,
          name: response.body!.name,
          email: response.body!.email,
          dni: response.body!.dni,
          phone: response.body!.phone,
          password,
          admin: response.body!.admin,
          tipo_trabajador: response.body!.tipo_trabajador,
          tipo_trabajador_desc: response.body!.tipo_trabajador_desc
        } as Employee;
      }

      this.loggedInUser = user;
      this.userIsLoggedInSubject.next(true);
      this.snackBar.open('Inicio de sesión correcto', 'Ok', { duration: 3000 });
      this.router.navigate(['/home']);
      return;
    }

    this.snackBar.open('Inicio de sesión incorrecto', 'Ok', { duration: 3000 });
  }

  public logOutUser(): void {
    this.httpClient
      .post<any>(`${environment.apiBaseUrl}auth/logout`, null, {
        observe: 'response',
        withCredentials: true,
      })
      .subscribe((result) => {
        if (result.ok) {
          this.loggedInUser = undefined;
          this.userIsLoggedInSubject.next(false);
          this.logOutEvent.next(null);
          this.localStorageService.removeItem('items');
        }
      });
  }

  public registerUser(name: string, email: string, password: string): void {
    this.httpClient
      .post<any>(
        `${environment.apiBaseUrl}auth/register`,
        {
          name,
          email,
          password,
        },
        { observe: 'response' }
      )
      .subscribe((result) => {
        if (result.ok) {
          this.snackBar.open(
            'Se ha realizado el registro correctamente',
            'Ok',
            { duration: 3000 }
          );
          this.router.navigate(['/login']);
        } else {
          this.snackBar.open(result.body.message, 'Ok', { duration: 3000 });
        }
      });
  }

  public initializeLoggedInUser(): void {
    this.httpClient
      .get<isAuthenticatedResponse>(
        `${environment.apiBaseUrl}auth/isAuthenticated`,
        { observe: 'response', withCredentials: true }
      )
      .subscribe((response) => {
        if (response.ok) {
          this.loggedInUser = response.body?.user;
          this.userIsLoggedInSubject.next(true);
        }
      });
  }

  public isLoggedIn(): boolean {
    return this.userIsLoggedInSubject.value;
  }
}
