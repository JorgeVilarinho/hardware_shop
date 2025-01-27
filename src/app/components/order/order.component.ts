import { OrdersService } from './../../services/orders.service';
import { Router, RouterModule } from '@angular/router';
import { Component, inject, OnInit } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { Order } from '../../models/order.model';
import { OrderStatusValue } from '../../models/orderStatusValue.model';
import { Product } from '../../models/product.model';
import { CurrencyPipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { CancelOrderDialogComponent } from '../cancel-order-dialog/cancel-order-dialog.component';

@Component({
  selector: 'app-order',
  imports: [ MatIcon, CurrencyPipe, RouterModule ],
  templateUrl: './order.component.html',
  styleUrl: './order.component.css'
})
export class OrderComponent implements OnInit {
  order: Order | undefined
  products: Product[] = []
  shippingOptionCost: number = 0

  pendingPayment = OrderStatusValue.PENDING_PAYMENT
  paid = OrderStatusValue.PAID
  canceled = OrderStatusValue.CANCELED

  ordersService = inject(OrdersService)
  dialog = inject(MatDialog)

  constructor(private router: Router) {
    this.order = this.router.getCurrentNavigation()?.extras.state!['order']
  }
  
  async ngOnInit(): Promise<void> {
    this.products = await this.ordersService.getProductsFromOrder(this.order?.id!)
    this.shippingOptionCost = await this.ordersService.getShippingOptionCost(this.order?.id_opcion_envio!)
  }

  public getSubtotal(): number {
    return this.order?.total! - this.shippingOptionCost
  }

  public getFormattedDate(createDate: string): string {
    return new Date(createDate).toLocaleDateString()
  }

  public isPayable(): boolean {
    const orderStatus = this.order?.estado_pedido_valor;

    if(orderStatus == OrderStatusValue.PENDING_PAYMENT) return true

    return false
  }

  public isCancelable(): boolean {
    const orderStatus = this.order?.estado_pedido_valor;

    if(orderStatus == OrderStatusValue.PENDING_PAYMENT || orderStatus == OrderStatusValue.PAID) return true

    return false
  }

  public goBack(): void {
    this.router.navigate(['account/orders/active'])
  }

  public goToPayment(): void {
    this.router.navigate(['/payment'], { state: { 'order': this.order } })
  }

  public async cancelOrder(): Promise<void> {
    const response = await this.ordersService.cancelOrder(this.order?.id!)

    const dialogRef = this.dialog.open(CancelOrderDialogComponent)
    dialogRef.componentInstance.canceled = response.ok
  }
}
