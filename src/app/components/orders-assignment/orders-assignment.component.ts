import { Component, inject } from '@angular/core';
import { Order } from '../../models/order.model';
import { OrderStatusValue } from '../../models/orderStatusValue.model';
import { OrdersService } from '../../services/orders.service';
import { CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { MatIcon } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { AdditionalInfoByParametersDialogComponent } from '../../additional-info-by-parameters-dialog/additional-info-by-parameters-dialog.component';

@Component({
  selector: 'app-orders-assignment',
  imports: [ CurrencyPipe, MatIcon ],
  templateUrl: './orders-assignment.component.html',
  styleUrl: './orders-assignment.component.css'
})
export class OrdersAssignmentComponent {
  private orderAssignmentTitle: string = 'Ordenación de pedidos'
  private orderAssignmentDescription: string = 'Los pedidos están ordenados desde la fecha creación más antigua hacia la más actual'
  unassignedOrders: Order[] = []
  
  pendingPayment = OrderStatusValue.PENDING_PAYMENT
  paid = OrderStatusValue.PAID
  canceled = OrderStatusValue.CANCELED
  
  ordersService = inject(OrdersService)
  router = inject(Router)
  dialog = inject(MatDialog)

  constructor() {}
  
  async ngOnInit(): Promise<void> {
    this.unassignedOrders = await this.ordersService.getUnassignedOrders()
  }

  public getImage(imageFile: string): string {
    return environment.apiImageUrl + imageFile
  }

  public getFormattedDate(createDate: string): string {
    return new Date(createDate).toLocaleDateString()
  }

  public goToSelectEmployee(orderId: number): void {
    this.router.navigate([`/dashboard/orders/${orderId}/assign`])
  }

  public openAddtionalInfoPopUpForOrderAssigment(): void {
    const dialogRef = this.dialog.open(AdditionalInfoByParametersDialogComponent);
    dialogRef.componentInstance.title = this.orderAssignmentTitle;
    dialogRef.componentInstance.description = this.orderAssignmentDescription;
  }
}
