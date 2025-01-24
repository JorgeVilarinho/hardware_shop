import { StateService } from './../../services/state.service';
import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { Address } from '../../models/address.model';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-address-initial',
  imports: [ RouterModule, MatIconModule, MatButtonModule ],
  templateUrl: './address-initial.component.html',
  styleUrl: './address-initial.component.css'
})
export class AddressInitialComponent implements OnInit {
  stateService = inject(StateService);
  userService = inject(UserService);
  addresses: Address[] = [];

  constructor() {
    this.userService.initializeAddressesSubject
      .pipe(takeUntilDestroyed())
      .subscribe(_addresses => {
        if(_addresses) {
          this.addresses = _addresses
        }
      }
    );

    this.userService.addedAddressSubject
     .pipe(takeUntilDestroyed())
     .subscribe(_address => {
      if(_address) {
        this.addresses.push(_address);
      }
     }
    );

    this.userService.deletedAddressSubject
      .pipe(takeUntilDestroyed())
      .subscribe(_id => {
        if(_id) {
          let index = this.addresses.findIndex(x => x.id == _id);

          this.addresses.splice(index, 1);
        }
      })
  }

  async ngOnInit(): Promise<void> {
    this.addresses = await this.userService.getAddresses();
  }

  changeToAddressCreateComponent(): void {
    this.stateService.changeInitialAddressComponentToInactive();
  }

  deleteAddress(id: number): void {
    this.userService.deleteAddress(id);
  }
}
