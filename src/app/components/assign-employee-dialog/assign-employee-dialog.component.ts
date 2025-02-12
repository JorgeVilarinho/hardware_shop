import { EmployeeService } from './../../services/employee.service';
import { Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-assign-employee-dialog',
  imports: [],
  templateUrl: './assign-employee-dialog.component.html',
  styleUrl: './assign-employee-dialog.component.css'
})
export class AssignEmployeeDialogComponent {
  orderId: number | null = null
  employeeId: number | null = null

  refDialog = inject(MatDialogRef<AssignEmployeeDialogComponent>)
  employeeService = inject(EmployeeService)
  snackBar = inject(MatSnackBar)
  router = inject(Router)

  public closeDialog(): void {
    this.refDialog.close()
  }

  public async assignEmployee(): Promise<void> {
    const response = await this.employeeService.assignEmployeeToOrder(this.orderId!, this.employeeId!)

    if(response.ok) this.snackBar.open('Se ha asignado correctamente el trabajador al pedido', 'Ok', { duration: 3000 })

    this.refDialog.close()
    this.router.navigate(['/dashboard/orders'])
  }
}
