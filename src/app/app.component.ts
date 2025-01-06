import { AuthenticationService } from './services/authentication.service';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import { SidenavCustomComponent } from './components/sidenav-custom/sidenav-custom.component';
import { StateService } from './services/state.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FiltersSidenavComponent } from './components/filters-sidenav/filters-sidenav.component';

@Component({
  selector: 'app-root',
  imports: [ RouterOutlet, HeaderComponent, MatSidenavModule, SidenavCustomComponent, FiltersSidenavComponent ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  stateService = inject(StateService);
  authenticationService = inject(AuthenticationService);
  menuOpenedState = false;
  filtersMenuOpenedState = false;

  constructor() {
    this.authenticationService.initializeLoggedInUser();
    this.listenToMenuOpened();
    this.listenToFiltersMenuOpened();
  }

  private listenToMenuOpened(): void {
    this.stateService.menuOpened
    .pipe(takeUntilDestroyed())
    .subscribe(actualValue => this.menuOpenedState = actualValue);
  }

  private listenToFiltersMenuOpened(): void {
    this.stateService.filterMenuOpened
    .pipe(takeUntilDestroyed())
    .subscribe(actualValue => this.filtersMenuOpenedState = actualValue);
  }
}
