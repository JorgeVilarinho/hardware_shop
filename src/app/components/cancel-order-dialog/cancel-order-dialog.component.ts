import { Component, inject, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cancel-order-dialog',
  imports: [ MatIcon ],
  templateUrl: './cancel-order-dialog.component.html',
  styleUrl: './cancel-order-dialog.component.css'
})
export class CancelOrderDialogComponent implements OnInit {
  canceled: boolean | undefined

  refDialog = inject(MatDialogRef<CancelOrderDialogComponent>)
  router = inject(Router)

  async ngOnInit(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 3000))
    this.refDialog.close()
    this.router.navigate(['/account/orders/canceled'])
  }
}
