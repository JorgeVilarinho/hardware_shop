import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  opened = new BehaviorSubject<boolean>(false);
  initialAddressComponentIsActive = new BehaviorSubject<boolean>(true);

  constructor() { }

  changeOpenedState(): void {
    this.opened.next(!this.opened.value);
  }

  changeInitialAddressComponentToActive(): void {
    this.initialAddressComponentIsActive.next(true);
  }

  changeInitialAddressComponentToInactive(): void {
    this.initialAddressComponentIsActive.next(false);
  }
}
