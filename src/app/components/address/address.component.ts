import { AfterViewInit, Component, inject } from '@angular/core';
import { StateService } from '../../services/state.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AddressInitialComponent } from '../address-initial/address-initial.component';
import { AddressCreateComponent } from "../address-create/address-create.component";

@Component({
  selector: 'app-address',
  imports: [ AddressInitialComponent, AddressCreateComponent ],
  templateUrl: './address.component.html',
  styleUrl: './address.component.css'
})
export class AddressComponent implements AfterViewInit {
  stateService = inject(StateService);
  initialAddresComponentIsActive: boolean;

  constructor() {
    this.stateService.initialAddressComponentIsActive
    .pipe(takeUntilDestroyed())
    .subscribe((_value) => this.initialAddresComponentIsActive = _value);

    this.initialAddresComponentIsActive = true;
  }

  ngAfterViewInit(): void {
    this.stateService.changeInitialAddressComponentToActive();
  }
}
