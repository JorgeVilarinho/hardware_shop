import { Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { OrdersService } from '../../services/orders.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-change-order-status-dialog',
  imports: [],
  templateUrl: './change-order-status-dialog.component.html',
  styleUrl: './change-order-status-dialog.component.css'
})
export class ChangeOrderStatusDialogComponent {
  orderId: number | null = null
  employeeId: string | null = null

  refDialog = inject(MatDialogRef<ChangeOrderStatusDialogComponent>)
  ordersService = inject(OrdersService)
  snackBar = inject(MatSnackBar)

  public closeDialog(): void {
    this.refDialog.close()
  }

  public async changeOrderStatus(): Promise<void> {
    if(!this.orderId || !this.employeeId) {
      this.snackBar.open('No se tienen los datos necesarios para poder cambiar el estado del pedido', 'Ok', { duration: 3000 })
      this.closeDialog()
      return
    }

    const response = await this.ordersService.updateOrderStatusByEmployee(this.orderId, this.employeeId)

    if(response.ok) {
      this.ordersService.fireUpdatedOrderStatusEvent(this.orderId)
      this.snackBar.open('Se ha actualizado correctamente el estado del pedido', 'Ok', { duration: 3000 })
    }

    this.closeDialog()
  }
}
