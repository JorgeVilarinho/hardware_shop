import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  httpClient = inject(HttpClient);

  opened = new BehaviorSubject<boolean>(false);
  initialAddressComponentIsActive = new BehaviorSubject<boolean>(true);

  constructor() { }

  public changeOpenedState(): void {
    this.opened.next(!this.opened.value);
  }

  public changeInitialAddressComponentToActive(): void {
    this.initialAddressComponentIsActive.next(true);
  }

  public changeInitialAddressComponentToInactive(): void {
    this.initialAddressComponentIsActive.next(false);
  }
}
