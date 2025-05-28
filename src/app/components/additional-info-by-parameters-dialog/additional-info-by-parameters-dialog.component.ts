import { Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-additional-info-by-parameters-dialog',
  imports: [],
  templateUrl: './additional-info-by-parameters-dialog.component.html',
  styleUrl: './additional-info-by-parameters-dialog.component.css'
})
export class AdditionalInfoByParametersDialogComponent {
  title: string | undefined
  description: string | undefined

  refDialog = inject(MatDialogRef<this>)
  
  closeDialog(): void {
    this.refDialog.close();
  }
}
