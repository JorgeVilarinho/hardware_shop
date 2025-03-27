import { Component, inject, OnInit } from '@angular/core';
import { Order } from '../../models/order.model';
import { OrderStatusValue } from '../../models/orderStatusValue.model';
import { OrdersService } from '../../services/orders.service';
import { CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-canceled-orders',
  imports: [ CurrencyPipe ],
  templateUrl: './canceled-orders.component.html',
  styleUrl: './canceled-orders.component.css'
})
export class CanceledOrdersComponent implements OnInit {
  canceledOrders: Order[] = []
  canceled = OrderStatusValue.CANCELED
  
  ordersService = inject(OrdersService)
  router = inject(Router)

  async ngOnInit(): Promise<void> {
    this.canceledOrders = await this.ordersService.getClientCanceledOrders()
  }

  public getImage(imageFile: string): string {
    return environment.apiImageUrl + imageFile
  }

  public getFormattedDate(createDate: string): string {
    return new Date(createDate).toLocaleDateString()
  }

  public openOrder(activeOrder: Order): void {
    this.router.navigate(['/account/orders/' + activeOrder.id], { state: { 'order': activeOrder } });
  }
}
