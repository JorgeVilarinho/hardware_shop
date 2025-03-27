import { Component, inject } from '@angular/core';
import { Order } from '../../models/order.model';
import { OrderStatusValue } from '../../models/orderStatusValue.model';
import { OrdersService } from '../../services/orders.service';
import { CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-orders-assignment',
  imports: [ CurrencyPipe ],
  templateUrl: './orders-assignment.component.html',
  styleUrl: './orders-assignment.component.css'
})
export class OrdersAssignmentComponent {
  unassignedOrders: Order[] = []
  
  pendingPayment = OrderStatusValue.PENDING_PAYMENT
  paid = OrderStatusValue.PAID
  canceled = OrderStatusValue.CANCELED
  
  ordersService = inject(OrdersService)
  router = inject(Router)

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
}
