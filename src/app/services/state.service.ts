import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  opened = new BehaviorSubject<boolean>(false);

  constructor() { }

  changeOpenedState() {
    this.opened.next(!this.opened.value);
  }
}
