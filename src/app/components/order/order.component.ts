import { OrdersService } from './../../services/orders.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Component, inject, OnInit } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { Order } from '../../models/order.model';
import { OrderStatusValue } from '../../models/orderStatusValue.model';
import { Product } from '../../models/product.model';
import { CurrencyPipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { CancelOrderDialogComponent } from '../cancel-order-dialog/cancel-order-dialog.component';
import { PcProduct } from '../../models/pcProduct.model';
import { Category } from '../../models/category.model';
import { CategoriesService } from '../../services/categories.service';
import { CategoryValue } from '../../models/categoryValue.model';

@Component({
  selector: 'app-order',
  imports: [ MatIcon, CurrencyPipe, RouterModule ],
  templateUrl: './order.component.html',
  styleUrl: './order.component.css'
})
export class OrderComponent implements OnInit {
  orderId: string | null = null

  order: Order | undefined
  products: Product[] = []
  pcProducts: PcProduct[] = []
  shippingOptionCost: number = 0
  boxCategory: Category | undefined

  pendingPayment = OrderStatusValue.PENDING_PAYMENT
  paid = OrderStatusValue.PAID
  canceled = OrderStatusValue.CANCELED

  ordersService = inject(OrdersService)
  categoriesService = inject(CategoriesService)
  dialog = inject(MatDialog)

  constructor(private route: ActivatedRoute, private router: Router) {
    this.orderId = this.route.snapshot.paramMap.get('id')
  }
  
  async ngOnInit(): Promise<void> {
    this.order = await this.ordersService.getOrderById(this.orderId!) ?? undefined
    this.products = await this.ordersService.getProductsFromOrder(this.order?.id!)
    this.pcProducts = await this.ordersService.getPcProductsFromOrder(this.order?.id!)
    this.shippingOptionCost = await this.ordersService.getShippingOptionCost(this.order?.id_opcion_envio!)
    this.boxCategory = await this.categoriesService.getCategoryByValue(CategoryValue.PC_TOWERS_AND_ENCLOSURES)
  }

  public getSubtotal(): number {
    return this.order?.total! - this.shippingOptionCost
  }

  public getFormattedDate(createDate: string): string {
    return new Date(createDate).toLocaleDateString()
  }

  public getBox(pcProduct: PcProduct): Product | undefined {
    console.log('Get Box:')
    console.log(this.boxCategory?.nombre)
    console.log(pcProduct.components.find(x => x.category == this.boxCategory?.nombre))
    return pcProduct.components.find(x => x.category == this.boxCategory?.nombre)
  }

  public someComponentHasDiscount(pcProduct: PcProduct): boolean {
    return pcProduct.components.some(x => x.discount > 0)
  }

  public getTotalWithoutDiscount(pcProduct: PcProduct): number {
    return pcProduct.components
    .map(component => component.price)
    .reduce((previous, current) => previous + current, 0)
  }

  public getTotalWithDiscount(pcProduct: PcProduct): number {
    return pcProduct.components
    .map(component => component.discount ? component.price * (100 - component.discount) / 100 : component.price)
    .reduce((previous, current) => previous + current, 0)
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
