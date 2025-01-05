import { AuthenticationService } from './../../services/authentication.service';
import { Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dialog-logout',
  imports: [],
  templateUrl: './dialog-logout.component.html',
  styleUrl: './dialog-logout.component.css'
})
export class DialogLogoutComponent {
  refDialog = inject(MatDialogRef<DialogLogoutComponent>);
  authenticationService = inject(AuthenticationService);
  router = inject(Router);

  closeDialog(): void {
    this.refDialog.close();
  }

  closeSessionAndDialog(): void {
    this.authenticationService.logOutUser();
    this.refDialog.close();
    this.router.navigate(['/home']);
  }
}
