import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LogoutService {
  logOutSubject = new BehaviorSubject<boolean>(false);

  constructor() { }

  public logOut() {
    this.logOutSubject.next(true);
  }
}
