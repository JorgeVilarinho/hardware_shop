import { Injectable, inject } from '@angular/core';
import { Client } from '../models/client.model';
import { BehaviorSubject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Address } from '../models/address.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  snackbar = inject(MatSnackBar);
  router = inject(Router);
  users: Array<Client> = [
    {
      name: 'Jorge Vilarño Cagiao',
      email: 'jorgevilarino05@gmail.com',
      password: 'january24'
    }
  ];
  loggedInUser = new BehaviorSubject<Client | null>(null);

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
      this.snackbar.open("Ya existe un usuario con ese email. Intentelo con otro email", "Ok", { duration: 3000 });
    } else {
      this.users.push({
        name,
        email,
        password
      });
      this.logInUser(email, password);
      this.router.navigate(['/home']);
    }
  }

  addAddressToLoggedInUser(address: Address): void {
    let user = this.loggedInUser.value;

    if(user) {
      const userToAddAddress = this.users.find((_user) =>_user.email === user.email);
      userToAddAddress!.address = address;
      this.snackbar.open("Se ha añadido correctamente la nueva dirección al usuario.", "Ok", { duration: 3000 })
    }
  }

  constructor() { }
}
