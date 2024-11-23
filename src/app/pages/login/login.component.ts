import { Component, inject } from '@angular/core';
import { StateService } from '../../services/state.service';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent  {
  stateService: StateService = inject(StateService);
}
