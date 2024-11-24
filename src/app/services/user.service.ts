import { Injectable, inject } from '@angular/core';
import { User } from '../models/user.model';
import { Client } from '../models/client.model';
import { BehaviorSubject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  snackbar = inject(MatSnackBar);
  router = inject(Router);
  users: Array<User> = [
    <Client> {
      name: 'Jorge Vilarño Cagiao',
      address: 'Rua Vigo Nº 44 2º Drch',
      email: 'jorgevilarino05@gmail.com',
      password: 'january24'
    }
  ];
  loggedInUser = new BehaviorSubject<User | null>(null);

  userExists(email: string): boolean {
    const user = this.users.find((_user) => _user.email == email);
    if(user) return true;

    return false;
  }

  logInUser(email: string, password: string): boolean {
    const user = this.users.find((_user) => _user.email == email && _user.password == password);
    if(user) {
      this.loggedInUser.next(user);
      return true
    }

    return false;
  }

  logOutUser() {
    this.loggedInUser.next(null);
  }

  registerUser(name: string, email: string, password: string): void {
    if(this.userExists(email)) {
      this.snackbar.open("Ya existe un usuario con ese email. Intentelo con otro email", "Ok", { duration: 3000 })
    } else {
      this.users.push(<Client> {
        name,
        email,
        password,
        address: undefined
      });
      this.logInUser(email, password);
      this.router.navigate(['/home']);
    }
  }

  constructor() { }
}
