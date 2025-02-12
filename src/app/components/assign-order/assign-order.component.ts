import { Component, inject, OnInit } from '@angular/core';
import { Employee } from '../../models/employee.model';
import { EmployeeService } from '../../services/employee.service';
import { MatIcon } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { AssignEmployeeDialogComponent } from '../assign-employee-dialog/assign-employee-dialog.component';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-assign-order',
  imports: [ MatIcon, RouterLink ],
  templateUrl: './assign-order.component.html',
  styleUrl: './assign-order.component.css'
})
export class AssignOrderComponent implements OnInit {
  employees: Employee[] = []
  orderId: string | null = null
  
  employeeService = inject(EmployeeService)
  dialog = inject(MatDialog)

  constructor(private route: ActivatedRoute) {}

  async ngOnInit(): Promise<void> {
    this.orderId = this.route.snapshot.paramMap.get('orderId');
    this.employees = await this.employeeService.getEmployeesOrderedByLessAssignedOrders()
  }

  public openDialog(employeeId: number): void {
    const dialogRef = this.dialog.open(AssignEmployeeDialogComponent)
    dialogRef.componentInstance.orderId = +this.orderId!
    dialogRef.componentInstance.employeeId = employeeId
  }
}
