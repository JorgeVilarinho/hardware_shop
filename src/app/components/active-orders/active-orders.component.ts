import { Component, inject, OnInit } from '@angular/core';
import { OrdersService } from '../../services/orders.service';
import { Order } from '../../models/order.model';
import { OrderStatusValue } from '../../models/orderStatusValue.model';
import { CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-active-orders',
  imports: [ CurrencyPipe ],
  templateUrl: './active-orders.component.html',
  styleUrl: './active-orders.component.css'
})
export class ActiveOrdersComponent implements OnInit {
  activeOrders: Order[] = []

  pendingPayment = OrderStatusValue.PENDING_PAYMENT
  paid = OrderStatusValue.PAID
  canceled = OrderStatusValue.CANCELED

  ordersService = inject(OrdersService)
  router = inject(Router)

  constructor() {}
  
  async ngOnInit(): Promise<void> {
    this.activeOrders = await this.ordersService.getClientActiveOrders()
  }

  public getFormattedDate(createDate: string): string {
    return new Date(createDate).toLocaleDateString()
  }

  public openOrder(activeOrder: Order): void {
    this.router.navigate(['/account/orders/' + activeOrder.id], { state: { 'order': activeOrder } });
  }
}
