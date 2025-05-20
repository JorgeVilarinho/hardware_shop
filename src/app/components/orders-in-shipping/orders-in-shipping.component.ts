import { Component, inject, OnInit } from '@angular/core';
import { Order } from '../../models/order.model';
import { CurrencyPipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { OrdersService } from '../../services/orders.service';
import { MatDialog } from '@angular/material/dialog';
import { ChangeOrderStatusDialogComponent } from '../change-order-status-dialog/change-order-status-dialog.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { environment } from '../../../environments/environment';
import { MatIcon } from '@angular/material/icon';
import { AdditionalInfoByParametersDialogComponent } from '../../additional-info-by-parameters-dialog/additional-info-by-parameters-dialog.component';

@Component({
  selector: 'app-orders-in-shipping',
  imports: [ CurrencyPipe, MatIcon ],
  templateUrl: './orders-in-shipping.component.html',
  styleUrl: './orders-in-shipping.component.css'
})
export class OrdersInShippingComponent implements OnInit {
  private ordersInShippingTitle: string = 
  'Ordenación de pedidos en proceso de envío'
  private ordersInShippingDescription: string = 
  'Los pedidos en proceso de envío están ordenados desde la fecha creación más antigua hacia la más actual'

  ordersInShipping: Order[] = []
  employeeId: string | null = null

  ordersService = inject(OrdersService)
  dialog = inject(MatDialog)

  constructor(private route: ActivatedRoute) {
    this.employeeId = this.route.snapshot.paramMap.get('id')
    this.listenToUpdatedOrderStatus()
  }

  async ngOnInit(): Promise<void> {
    this.ordersInShipping = await this.ordersService.getOrdersInShipping(this.employeeId!)
  }

  public getImage(imageFile: string): string {
    return environment.apiImageUrl + imageFile
  }

  public getFormattedDate(createDate: string): string {
    return new Date(createDate).toLocaleDateString()
  }

  public openDialog(orderId: number) {
    const dialogRef = this.dialog.open(ChangeOrderStatusDialogComponent)
    dialogRef.componentInstance.orderId = orderId
    dialogRef.componentInstance.employeeId = this.employeeId
  }

  public openAddtionalInfoPopUpForOrdersInShipping(): void {
    const dialogRef = this.dialog.open(AdditionalInfoByParametersDialogComponent);
    dialogRef.componentInstance.title = this.ordersInShippingTitle;
    dialogRef.componentInstance.description = this.ordersInShippingDescription;
  }

  private listenToUpdatedOrderStatus() {
    this.ordersService.updatedOrderStatus$
    .pipe(takeUntilDestroyed())
    .subscribe(orderId => {
      const orderIndex = this.ordersInShipping.findIndex(x => x.id == orderId)

      if(orderIndex == -1) return

      this.ordersInShipping.splice(orderIndex, 1)
    })
  }
}
