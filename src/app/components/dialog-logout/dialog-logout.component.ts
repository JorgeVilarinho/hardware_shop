import { Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dialog-logout',
  imports: [],
  templateUrl: './dialog-logout.component.html',
  styleUrl: './dialog-logout.component.css'
})
export class DialogLogoutComponent {
  refDialog = inject(MatDialogRef<DialogLogoutComponent>);
  userService = inject(UserService);
  router = inject(Router);

  closeDialog(): void {
    this.refDialog.close();
  }

  closeSessionAndDialog(): void {
    this.userService.logOutUser();
    this.refDialog.close();
    this.router.navigate(['/home']);
  }
}
