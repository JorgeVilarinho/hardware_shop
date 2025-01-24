import { OrdersService } from './../../services/orders.service';
import { Router } from '@angular/router';
import { Component, inject, OnInit } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { ActiveOrder } from '../../models/activeOrder.model';
import { OrderStatusValue } from '../../models/orderStatusValue.model';
import { Product } from '../../models/product.model';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-order',
  imports: [ MatIcon, CurrencyPipe ],
  templateUrl: './order.component.html',
  styleUrl: './order.component.css'
})
export class OrderComponent implements OnInit {
  order: ActiveOrder | undefined
  products: Product[] = []

  pendingPayment = OrderStatusValue.PENDING_PAYMENT
  canceled = OrderStatusValue.CANCELED

  ordersService = inject(OrdersService)

  constructor(private router: Router) {
    this.order = this.router.getCurrentNavigation()?.extras.state!['order']
  }
  
  async ngOnInit(): Promise<void> {
    this.products = await this.ordersService.getProductsFromOrder(this.order?.id!)
    console.log(this.products)
  }

  public getFormattedDate(createDate: string): string {
    return new Date(createDate).toLocaleDateString()
  }

  public goBack(): void {
    this.router.navigate(['account/orders/active'])
  }
}
