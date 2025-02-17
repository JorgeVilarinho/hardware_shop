import { Component, inject, OnInit } from '@angular/core';
import { Order } from '../../models/order.model';
import { CurrencyPipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { OrdersService } from '../../services/orders.service';

@Component({
  selector: 'app-orders-in-shipping',
  imports: [ CurrencyPipe ],
  templateUrl: './orders-in-shipping.component.html',
  styleUrl: './orders-in-shipping.component.css'
})
export class OrdersInShippingComponent implements OnInit {
  ordersInShipping: Order[] = []
  employeeId: string | null = null

  ordersService = inject(OrdersService)

  constructor(private route: ActivatedRoute) {
    this.employeeId = this.route.snapshot.paramMap.get('id')
  }

  async ngOnInit(): Promise<void> {
    // TODO: this.ordersInShipping = await this.ordersService.getOrdersInShipping()
  }

  public getFormattedDate(createDate: string): string {
    return new Date(createDate).toLocaleDateString()
  }
}
