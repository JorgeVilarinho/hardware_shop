import { Component, inject, OnInit } from '@angular/core';
import { OrdersService } from '../../services/orders.service';
import { ActiveOrder } from '../../models/activeOrder.model';
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
  activeOrders: ActiveOrder[] = []

  pendingPayment = OrderStatusValue.PENDING_PAYMENT
  canceled = OrderStatusValue.CANCELED

  ordersService = inject(OrdersService)
  router = inject(Router)

  constructor() {}
  
  async ngOnInit(): Promise<void> {
    this.activeOrders = await this.ordersService.getActiveOrders()
  }

  public getFormattedDate(createDate: string): string {
    return new Date(createDate).toLocaleDateString()
  }

  public openOrder(activeOrder: ActiveOrder): void {
    this.router.navigate(['/account/orders/' + activeOrder.id], { state: { 'order': activeOrder } });
  }
}
