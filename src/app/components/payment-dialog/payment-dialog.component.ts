import { OrdersService } from './../../services/orders.service';
import { Component, inject, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Order } from '../../models/order.model';
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment-dialog',
  imports: [ MatIcon ],
  templateUrl: './payment-dialog.component.html',
  styleUrl: './payment-dialog.component.css'
})
export class PaymentDialogComponent implements OnInit {
  order: Order | undefined
  orderId: number | undefined

  refDialog = inject(MatDialogRef<PaymentDialogComponent>)
  router = inject(Router)
  ordersService = inject(OrdersService)

  async ngOnInit(): Promise<void> {
    if(!this.order) {
      await this.ordersService.cancelOrder(this.orderId!)
    }

    this.router.navigate(['/account/orders/active'])
    await new Promise(resolve => setTimeout(resolve, 3000))
    this.refDialog.close()
  }
}
