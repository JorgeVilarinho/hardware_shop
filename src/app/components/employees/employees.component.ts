import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Employee } from '../../models/employee.model';
import { EmployeeService } from '../../services/employee.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-employees',
  imports: [ MatIconModule, MatButtonModule, RouterLink ],
  templateUrl: './employees.component.html',
  styleUrl: './employees.component.css'
})
export class EmployeesComponent implements OnInit {
  employees: Employee[] = []

  employeeService = inject(EmployeeService)
  snackBar = inject(MatSnackBar)
  router = inject(Router)

  constructor(private route: ActivatedRoute) {}

  async ngOnInit(): Promise<void> {
    this.employees = await this.employeeService.getAllEmployees()
  }

  public async deleteEmployee(user_id: number): Promise<void> {
    const response = await this.employeeService.deleteEmployee(user_id)

    if(response.ok) {
      const indexToDelete = this.employees.findIndex(x => x.user_id == user_id)
      this.employees.splice(indexToDelete, 1)
    } else {
      this.snackBar.open(response.body!.message!, 'Ok', { duration: 3000 })
    }
  }

  public goToUpdateEmployee(employee: Employee): void {
    // this.router.navigate([employee.id], { relativeTo: this.route, state: { employee } })
  }
}
