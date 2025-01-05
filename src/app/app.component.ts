import { AuthenticationService } from './services/authentication.service';
import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import { SidenavCustomComponent } from './components/sidenav-custom/sidenav-custom.component';
import { StateService } from './services/state.service';

@Component({
  selector: 'app-root',
  imports: [ RouterOutlet, HeaderComponent, MatSidenavModule, SidenavCustomComponent ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  stateService = inject(StateService);
  authenticationService = inject(AuthenticationService);
  openedState: boolean | undefined;

  constructor() {
    this.authenticationService.initializeLoggedInUser();
  }

  ngOnInit(): void {
    this.stateService.opened.subscribe((actualValue) =>
      this.openedState = actualValue);
  }
}
