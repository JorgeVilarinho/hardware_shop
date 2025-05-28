import { AuthenticationService } from './../../services/authentication.service';
import { CurrencyPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Order } from '../../models/order.model';
import { OrdersService } from '../../services/orders.service';
import { ChangeOrderStatusDialogComponent } from '../change-order-status-dialog/change-order-status-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { environment } from '../../../environments/environment';
import { MatIcon } from '@angular/material/icon';
import { AdditionalInfoByParametersDialogComponent } from '../additional-info-by-parameters-dialog/additional-info-by-parameters-dialog.component';

@Component({
  selector: 'app-orders-in-shop',
  imports: [ CurrencyPipe, MatIcon ],
  templateUrl: './orders-in-shop.component.html',
  styleUrl: './orders-in-shop.component.css'
})
export class OrdersInShopComponent implements OnInit {
  private ordersInShopTitle: string = 
  'Ordenación de pedidos en tienda'
  private ordersInShopDescription: string = 
  'Los pedidos en tienda están ordenados desde la fecha creación más antigua hacia la más actual'

  ordersInShop: Order[] = []

  ordersService = inject(OrdersService)
  authenticationService = inject(AuthenticationService)
  dialog = inject(MatDialog)

  constructor() {
    this.listenToUpdatedOrderStatus()
  }

  async ngOnInit(): Promise<void> {
    this.ordersInShop = await this.ordersService.getOrdersInShop()
  }

  public getImage(imageFile: string): string {
    return environment.apiImageUrl + imageFile
  }

  public getFormattedDate(createDate: string): string {
    return new Date(createDate).toLocaleDateString()
  }

  public openDialog(orderId: number) {
    const dialogRef = this.dialog.open(ChangeOrderStatusDialogComponent)
    dialogRef.componentInstance!.employeeId = this.authenticationService.getEmployeeId().toString()
    dialogRef.componentInstance!.orderId = orderId
  }

  public openAddtionalInfoPopUpForOrdersInShop(): void {
    const dialogRef = this.dialog.open(AdditionalInfoByParametersDialogComponent);
    dialogRef.componentInstance.title = this.ordersInShopTitle;
    dialogRef.componentInstance.description = this.ordersInShopDescription;
  }

  private listenToUpdatedOrderStatus() {
    this.ordersService.updatedOrderStatus$
    .pipe(takeUntilDestroyed())
    .subscribe(orderId => {
      const orderIndex = this.ordersInShop.findIndex(x => x.id == orderId)
  
      if(orderIndex == -1) return

      this.ordersInShop.splice(orderIndex, 1)
    })
  }
}
