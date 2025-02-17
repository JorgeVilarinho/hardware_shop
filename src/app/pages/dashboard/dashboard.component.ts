import { AuthenticationService } from './../../services/authentication.service';
import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Employee } from '../../models/employee.model';

@Component({
  selector: 'app-dashboard',
  imports: [ NgClass, RouterModule ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  myDataIsActive = true
  ordersAssignedToMeIsActive = false
  ordersInShippingIsActive = false
  employeesIsActive = false
  ordersIsActive = false

  authenticationService = inject(AuthenticationService)
  router = inject(Router)

  constructor() {
    this.myDataIsActive = true
    this.ordersAssignedToMeIsActive = false
    this.ordersInShippingIsActive = false
    this.employeesIsActive = false
    this.ordersIsActive = false
    this.router.navigate(['/dashboard/data'])
  }

  public changeSelectedOption(menu: string): void {
    switch(menu) {
      case 'myData':
        this.myDataIsActive = true
        this.ordersAssignedToMeIsActive = false
        this.ordersInShippingIsActive = false
        this.employeesIsActive = false
        this.ordersIsActive = false
        this.router.navigate(['/dashboard/data'])
        break
      case 'ordersAssignedToMe':
        this.myDataIsActive = false
        this.ordersAssignedToMeIsActive = true
        this.ordersInShippingIsActive = false
        this.employeesIsActive = false
        this.ordersIsActive = false
        this.router.navigate([`/dashboard/employee/${this.getEmployeeId()}/orders`])
        break
      case 'ordersInShipping':
        this.myDataIsActive = false
        this.ordersAssignedToMeIsActive = false
        this.ordersInShippingIsActive = true
        this.employeesIsActive = false
        this.ordersIsActive = false
        this.router.navigate([`/dashboard/employee/${this.getEmployeeId()}/orders/in-shipping`])
        break
      case 'employees': 
        this.myDataIsActive = false
        this.ordersAssignedToMeIsActive = false
        this.ordersInShippingIsActive = false
        this.employeesIsActive = true
        this.ordersIsActive = false
        this.router.navigate(['/dashboard/employees'])
        break
      case 'orders':
        this.myDataIsActive = false
        this.ordersAssignedToMeIsActive = false
        this.ordersInShippingIsActive = false
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

  public isEmployeeAndDelivery(): boolean {
    return this.authenticationService.isEmployeeAndDelivery()
  }

  public getEmployeeId(): number {
    const employee = this.authenticationService.loggedInUser as Employee

    return employee.id
  }
}
