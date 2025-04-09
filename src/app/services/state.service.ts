import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  menuOpened = new BehaviorSubject<boolean>(false);
  filterMenuOpened = new BehaviorSubject<boolean>(false);
  initialAddressComponentIsActive = new BehaviorSubject<boolean>(true);
  resetDashboardStateSubject = new Subject<void>();

  constructor() { }

  public changeMenuOpenedState(): void {
    this.menuOpened.next(!this.menuOpened.value);
  }

  public changeFilterMenuOpenedState(): void {
    this.filterMenuOpened.next(!this.filterMenuOpened.value);
  }

  public changeInitialAddressComponentToActive(): void {
    this.initialAddressComponentIsActive.next(true);
  }

  public changeInitialAddressComponentToInactive(): void {
    this.initialAddressComponentIsActive.next(false);
  }

  public resetDashboardState(): void {
    this.resetDashboardStateSubject.next()
  }
}
