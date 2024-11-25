import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { NgClass } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialog } from '@angular/material/dialog';
import { DialogLogoutComponent } from '../../components/dialog-logout/dialog-logout.component';

@Component({
  selector: 'app-account',
  imports: [ MatTabsModule, NgClass, RouterOutlet, RouterLink ],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css'
})
export class AccountComponent implements OnInit {
  ordersIsActive = true;
  addressIsActive = false;
  dataIsActive = false;
  router = inject(Router);
  dialog = inject(MatDialog);

  ngOnInit(): void {
    this.router.navigate(['/account/orders']);
  }

  changeSelected(menu: string): void {
    switch(menu) {
      case 'orders':
        this.ordersIsActive = true;
        this.addressIsActive = false;
        this.dataIsActive = false;
        break;
      case 'address':
        this.ordersIsActive = false;
        this.addressIsActive = true;
        this.dataIsActive = false;
        break;
      case 'data':
        this.ordersIsActive = false;
        this.addressIsActive = false;
        this.dataIsActive = true;
    }
  }

  openCloseSessionDialog(): void {
    this.dialog.open(DialogLogoutComponent)
  }
}
