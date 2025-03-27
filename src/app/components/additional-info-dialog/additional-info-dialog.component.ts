import { Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { PaymentOption } from '../../models/paymentOption.model';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-additional-info-dialog',
  imports: [],
  templateUrl: './additional-info-dialog.component.html',
  styleUrl: './additional-info-dialog.component.css'
})
export class AdditionalInfoDialogComponent {
  paymentOption: PaymentOption | undefined
  
  refDialog = inject(MatDialogRef<AdditionalInfoDialogComponent>)

  public getImage(imageFile: string | undefined): string {
    return environment.apiImageUrl + imageFile
  }

  closeDialog(): void {
    this.refDialog.close();
  }
}
