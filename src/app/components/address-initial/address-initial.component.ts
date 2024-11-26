import { StateService } from './../../services/state.service';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-address-initial',
  imports: [ RouterModule ],
  templateUrl: './address-initial.component.html',
  styleUrl: './address-initial.component.css'
})
export class AddressInitialComponent {
  stateService = inject(StateService);

  changeToAddressCreateComponent(): void {
    this.stateService.changeInitialAddressComponentToInactive();
  }
}
