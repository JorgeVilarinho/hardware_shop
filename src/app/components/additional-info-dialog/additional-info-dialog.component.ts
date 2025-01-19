import { Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { PaymentOption } from '../../models/paymentOption.model';

@Component({
  selector: 'app-additional-info-dialog',
  imports: [],
  templateUrl: './additional-info-dialog.component.html',
  styleUrl: './additional-info-dialog.component.css'
})
export class AdditionalInfoDialogComponent {
  paymentOption: PaymentOption | undefined
  
  refDialog = inject(MatDialogRef<AdditionalInfoDialogComponent>)

  closeDialog(): void {
    this.refDialog.close();
  }
}
