import { StateService } from './../../services/state.service';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { Address } from '../../models/address.model';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-address-initial',
  imports: [ RouterModule, MatIconModule, MatButtonModule ],
  templateUrl: './address-initial.component.html',
  styleUrl: './address-initial.component.css'
})
export class AddressInitialComponent {
  stateService = inject(StateService);
  userService = inject(UserService);
  address: Address | undefined;

  constructor() {
    // this.userService.userIsLoggedIn
    // .pipe(takeUntilDestroyed())
    // .subscribe((_user) => this.address = _user?.address);
  }

  changeToAddressCreateComponent(): void {
    this.stateService.changeInitialAddressComponentToInactive();
  }

  deleteAddress(): void {
    this.userService.deleteAddressToLoggedInUser();
  }
}
