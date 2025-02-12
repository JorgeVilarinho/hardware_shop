import { AuthenticationService } from './../../services/authentication.service';
import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [ NgClass, RouterModule ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  myDataIsActive = true
  employeesIsActive = false
  ordersIsActive = false

  authenticationService = inject(AuthenticationService)
  router = inject(Router)

  public changeSelectedOption(menu: string): void {
    switch(menu) {
      case 'myData':
        this.myDataIsActive = true
        this.employeesIsActive = false
        this.ordersIsActive = false
        this.router.navigate(['/dashboard/data'])
        break
      case 'employees': 
        this.myDataIsActive = false
        this.employeesIsActive = true
        this.ordersIsActive = false
        this.router.navigate(['/dashboard/employees'])
        break
      case 'orders':
        this.myDataIsActive = false
        this.employeesIsActive = false
        this.ordersIsActive = true
        this.router.navigate(['/dashboard/orders'])
    }
  }

  public isLoggedIn(): boolean {
    return this.authenticationService.isLoggedIn()
  }

  public isEmployeeAndAdmin(): boolean {
    return this.authenticationService.isEmployeeAndAdmin()
  }
}
