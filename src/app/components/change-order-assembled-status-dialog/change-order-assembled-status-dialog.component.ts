import { Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { OrdersService } from '../../services/orders.service';

@Component({
  selector: 'app-change-order-assembled-status-dialog',
  imports: [],
  templateUrl: './change-order-assembled-status-dialog.component.html',
  styleUrl: './change-order-assembled-status-dialog.component.css'
})
export class ChangeOrderAssembledStatusDialogComponent {
  orderId: number | null = null

  refDialog = inject(MatDialogRef<this>)
  ordersService = inject(OrdersService)
  snackBar = inject(MatSnackBar)

  public closeDialog(): void {
    this.refDialog.close()
  }

  public async changeAssembledStatus(): Promise<void> {
    if(!this.orderId) {
      this.snackBar.open('No se tienen los datos necesarios para poder cambiar el montaje de los PCs del pedido', 'Ok', { duration: 3000 })
      this.closeDialog()
      return
    }

    const response = await this.ordersService.updateOrderAssembledStatusByEmployee(this.orderId)

    if(response.ok) {
      this.ordersService.fireUpdatedOrderStatusEvent(this.orderId)
      this.snackBar.open('Se ha actualizado correctamente el montaje de los PCs del pedido', 'Ok', { duration: 3000 })
    }

    this.closeDialog()
  }
}
