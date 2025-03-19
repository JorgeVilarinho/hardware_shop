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
  ordersInShopIsActive = false
  ordersInShippingIsActive = false
  employeesIsActive = false
  productsIsActive = false
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
        this.ordersInShopIsActive = false
        this.ordersInShippingIsActive = false
        this.employeesIsActive = false
        this.productsIsActive = false
        this.ordersIsActive = false
        this.router.navigate(['/dashboard/data'])
        break
      case 'ordersAssignedToMe':
        this.myDataIsActive = false
        this.ordersAssignedToMeIsActive = true
        this.ordersInShopIsActive = false
        this.ordersInShippingIsActive = false
        this.employeesIsActive = false
        this.productsIsActive = false
        this.ordersIsActive = false
        this.router.navigate([`/dashboard/employee/${this.getEmployeeId()}/orders`])
        break
      case 'ordersInShop':
        this.myDataIsActive = false
        this.ordersAssignedToMeIsActive = false
        this.ordersInShopIsActive = true
        this.ordersInShippingIsActive = false
        this.employeesIsActive = false
        this.productsIsActive = false
        this.ordersIsActive = false
        this.router.navigate([`/dashboard/orders/in-shop`])
        break
      case 'ordersInShipping':
        this.myDataIsActive = false
        this.ordersAssignedToMeIsActive = false
        this.ordersInShopIsActive = false
        this.ordersInShippingIsActive = true
        this.employeesIsActive = false
        this.productsIsActive = false
        this.ordersIsActive = false
        this.router.navigate([`/dashboard/employee/${this.getEmployeeId()}/orders/in-shipping`])
        break
      case 'employees': 
        this.myDataIsActive = false
        this.ordersAssignedToMeIsActive = false
        this.ordersInShopIsActive = false
        this.ordersInShippingIsActive = false
        this.employeesIsActive = true
        this.productsIsActive = false
        this.ordersIsActive = false
        this.router.navigate(['/dashboard/employees'])
        break
      case 'products':
        this.myDataIsActive = false
        this.ordersAssignedToMeIsActive = false
        this.ordersInShopIsActive = false
        this.ordersInShippingIsActive = false
        this.employeesIsActive = false
        this.productsIsActive = true
        this.ordersIsActive = false
        this.router.navigate(['/dashboard/products'])
        break
      case 'orders':
        this.myDataIsActive = false
        this.ordersAssignedToMeIsActive = false
        this.ordersInShopIsActive = false
        this.ordersInShippingIsActive = false
        this.employeesIsActive = false
        this.productsIsActive = false
        this.ordersIsActive = true
        this.router.navigate(['/dashboard/orders'])
    }
  }

  public isLoggedIn(): boolean {
    return this.authenticationService.isLoggedIn()
  }

  public isAdminEmployee(): boolean {
    return this.authenticationService.isAdminEmployee()
  }

  public isAdminAndDeliveryOrAssemblerEmployee(): boolean {
    return this.authenticationService.isAdminAndDeliveryOrAssemblerEmployee()
  }

  public isNotAdminAndDeliveryEmployee(): boolean {
    return this.authenticationService.isNotAdminAndDeliveryEmployee()
  }

  public isNotAdminAndShopClerkEmployee(): boolean {
    return this.authenticationService.isNotAdminAndShopClerkEmployee()
  }

  public isNotAdminAndDeliveryOrAssemblerEmployee(): boolean {
    return this.authenticationService.isNotAdminAndDeliveryOrAssemblerEmployee()
  }

  public getEmployeeId(): number {
    const employee = this.authenticationService.loggedInUser as Employee

    return employee.id
  }
}
