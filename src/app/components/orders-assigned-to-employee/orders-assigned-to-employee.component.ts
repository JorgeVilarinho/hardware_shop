import { OrdersService } from './../../services/orders.service';
import { CurrencyPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Order } from '../../models/order.model';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ChangeOrderStatusDialogComponent } from '../change-order-status-dialog/change-order-status-dialog.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Employee } from '../../models/employee.model';
import { EmployeeService } from '../../services/employee.service';
import { EmployeeTypeValue } from '../../models/employeeTypeValue';
import { ChangeOrderAssembledStatusDialogComponent } from '../change-order-assembled-status-dialog/change-order-assembled-status-dialog.component';
import { environment } from '../../../environments/environment';
import { MatIcon } from '@angular/material/icon';
import { AdditionalInfoByParametersDialogComponent } from '../../additional-info-by-parameters-dialog/additional-info-by-parameters-dialog.component';

@Component({
  selector: 'app-orders-assigned-to-employee',
  imports: [ CurrencyPipe, MatIcon ],
  templateUrl: './orders-assigned-to-employee.component.html',
  styleUrl: './orders-assigned-to-employee.component.css'
})
export class OrdersAssignedToEmployeeComponent implements OnInit {
  private ordersAssignedToActualEmployeeTitle: string = 'Ordenación de pedidos asignados a mi'
  private ordersAssignedToActualEmployeeDescription: string = 
  'Los pedidos asignados a mi están ordenados desde la fecha creación más antigua hacia la más actual'

  assignedOrders: Order[] = []
  employeeId: string | null = null
  employee: Employee | null = null

  ordersService = inject(OrdersService)
  employeesService = inject(EmployeeService)
  dialog = inject(MatDialog)

  constructor(private route: ActivatedRoute) {
    this.employeeId = this.route.snapshot.paramMap.get('id')
    this.listenToUpdatedOrderStatus()
  }

  async ngOnInit(): Promise<void> {
    this.assignedOrders = await this.ordersService.getAssignedOrders(this.employeeId)
    this.employee = await this.employeesService.getEmployee(this.employeeId)
  }

  public getImage(imageFile: string): string {
    return environment.apiImageUrl + imageFile
  }

  public getFormattedDate(createDate: string): string {
    return new Date(createDate).toLocaleDateString()
  }

  public openDialog(orderId: number): void {
    if(this.isDeliveryEmployee()) {
      const dialogRef = this.dialog.open(ChangeOrderStatusDialogComponent)
      dialogRef.componentInstance.orderId = orderId
      dialogRef.componentInstance.employeeId = this.employeeId
    } else {
      const dialogRef = this.dialog.open(ChangeOrderAssembledStatusDialogComponent)
      dialogRef.componentInstance.orderId = orderId
    }
  }

  public isDeliveryEmployee(): boolean {
    let employeeTypeValue = this.employee?.tipo_trabajador as EmployeeTypeValue

    return employeeTypeValue == EmployeeTypeValue.DELIVERY
  }

  public isAssemblerEmployee(): boolean {
    let employeeTypeValue = this.employee?.tipo_trabajador as EmployeeTypeValue

    return employeeTypeValue == EmployeeTypeValue.COMPUTER_ASSEMBLER
  }

  public openAddtionalInfoPopUpForOrdersAssignedToActualEmployee(): void {
    const dialogRef = this.dialog.open(AdditionalInfoByParametersDialogComponent);
    dialogRef.componentInstance.title = this.ordersAssignedToActualEmployeeTitle;
    dialogRef.componentInstance.description = this.ordersAssignedToActualEmployeeDescription;
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
