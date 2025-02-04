import { AuthenticationService } from './../../services/authentication.service';
import { StateService } from './../../services/state.service';
import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { Router, RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DialogLogoutComponent } from '../dialog-logout/dialog-logout.component';
import { UserTypeInferenceHelper } from '../../helpers/userTypeInference.helper';

@Component({
  selector: 'app-sidenav-custom',
  imports: [ MatIconModule, MatIconButton, MatListModule, RouterLink ],
  templateUrl: './sidenav-custom.component.html',
  styleUrl: './sidenav-custom.component.css'
})
export class SidenavCustomComponent {
  stateService = inject(StateService)
  authenticationService = inject(AuthenticationService)
  router = inject(Router)
  dialog = inject(MatDialog)

  public changeOpenedState(): void {
    this.stateService.menuOpened.next(!this.stateService.menuOpened.value)
  }

  public isLoggedIn(): boolean {
    return this.authenticationService.isLoggedIn()
  }

  public goToShop(): void {
    this.changeOpenedState()
    this.router.navigate(['/home'])
  }

  public goToLogin(): void {
    this.changeOpenedState()
    this.router.navigate(['/login'])
  }

  public goToAccount(): void {
    this.changeOpenedState()
    this.router.navigate(['/account/orders/active'])
  }

  public goToDashboard(): void {
    this.changeOpenedState()
    this.router.navigate(['/dashboard'])
  }
  
  public openLogOutDialog(): void {
    this.changeOpenedState()
    this.dialog.open(DialogLogoutComponent)
  }

  public isEmployee(): boolean {
    let user = this.authenticationService.loggedInUser!

    let employee = UserTypeInferenceHelper.isEmployee(user)

    if(employee) return true

    return false
  }
}
