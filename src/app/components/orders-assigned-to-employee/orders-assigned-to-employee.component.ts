import { OrdersService } from './../../services/orders.service';
import { CurrencyPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Order } from '../../models/order.model';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ChangeOrderStatusDialogComponent } from '../change-order-status-dialog/change-order-status-dialog.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-orders-assigned-to-employee',
  imports: [ CurrencyPipe ],
  templateUrl: './orders-assigned-to-employee.component.html',
  styleUrl: './orders-assigned-to-employee.component.css'
})
export class OrdersAssignedToEmployeeComponent implements OnInit {
  assignedOrders: Order[] = []
  employeeId: string | null = null

  ordersService = inject(OrdersService)
  dialog = inject(MatDialog)

  constructor(private route: ActivatedRoute) {
    this.employeeId = this.route.snapshot.paramMap.get('id')
    this.listenToUpdatedOrderStatus()
  }

  async ngOnInit(): Promise<void> {
    this.assignedOrders = await this.ordersService.getAssignedOrders(this.employeeId)
  }

  public getFormattedDate(createDate: string): string {
    return new Date(createDate).toLocaleDateString()
  }

  public openDialog(orderId: number): void {
    const dialogRef = this.dialog.open(ChangeOrderStatusDialogComponent)
    dialogRef.componentInstance.orderId = orderId
    dialogRef.componentInstance.employeeId = this.employeeId
  }

  private listenToUpdatedOrderStatus() {
    this.ordersService.updatedOrderStatus$
    .pipe(takeUntilDestroyed())
    .subscribe(orderId => {
      const orderIndex = this.assignedOrders.findIndex(x => x.id == orderId)

      if(orderIndex == -1) return

      this.assignedOrders.splice(orderIndex, 1)
    })
  }
}
