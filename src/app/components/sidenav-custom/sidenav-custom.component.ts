import { StateService } from './../../services/state.service';
import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-sidenav-custom',
  imports: [ MatIconModule, MatIconButton, MatListModule ],
  templateUrl: './sidenav-custom.component.html',
  styleUrl: './sidenav-custom.component.css'
})
export class SidenavCustomComponent {
  stateService: StateService = inject(StateService);

  changeOpenedState() {
    this.stateService.opened.next(!this.stateService.opened.value);
  }
}
