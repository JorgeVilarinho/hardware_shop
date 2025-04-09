import { AuthenticationService } from './../../services/authentication.service';
import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Employee } from '../../models/employee.model';
import { StateService } from '../../services/state.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-dashboard',
  imports: [ NgClass, RouterModule ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  public myDataIsActive: boolean
  public ordersAssignedToMeIsActive: boolean
  public ordersInShopIsActive: boolean
  public ordersInShippingIsActive: boolean
  public employeesIsActive: boolean
  public productsIsActive: boolean
  public ordersIsActive: boolean

  authenticationService = inject(AuthenticationService)
  stateService = inject(StateService)
  router = inject(Router)

  constructor() {
    this.myDataIsActive = true
    this.ordersAssignedToMeIsActive = false
    this.ordersInShopIsActive = false
    this.ordersInShippingIsActive = false
    this.employeesIsActive = false
    this.productsIsActive = false
    this.ordersIsActive = false
    this.router.navigate(['/dashboard/data'])

    this.listenToResetDashboardState()
  }

  public changeSelectedOption(menu: string): void {
    switch(menu) {
      case 'myData':
        this.changeToMyDataTabDashboard()
        this.router.navigate(['/dashboard/data'])
        break
      case 'ordersAssignedToMe':
        this.changeToOrdersAssignedToMeTabDashboard()
        this.router.navigate([`/dashboard/employee/${this.getEmployeeId()}/orders`])
        break
      case 'ordersInShop':
        this.changeToOrdersInShopTabDashboard()
        this.router.navigate([`/dashboard/orders/in-shop`])
        break
      case 'ordersInShipping':
        this.changeToOrdersInShippingTabDashboard()
        this.router.navigate([`/dashboard/employee/${this.getEmployeeId()}/orders/in-shipping`])
        break
      case 'employees': 
      this.changeToEmployeesTabDashboard()
        this.router.navigate(['/dashboard/employees'])
        break
      case 'products':
        this.changeToProductsTabDashboard()
        this.router.navigate(['/dashboard/products'])
        break
      case 'orders':
        this.changeToOrdersTabDashboard()
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

  private changeToMyDataTabDashboard(): void {
    this.myDataIsActive = true
    this.ordersAssignedToMeIsActive = false
    this.ordersInShopIsActive = false
    this.ordersInShippingIsActive = false
    this.employeesIsActive = false
    this.productsIsActive = false
    this.ordersIsActive = false
  }

  private changeToOrdersAssignedToMeTabDashboard(): void {
    this.myDataIsActive = false
    this.ordersAssignedToMeIsActive = true
    this.ordersInShopIsActive = false
    this.ordersInShippingIsActive = false
    this.employeesIsActive = false
    this.productsIsActive = false
    this.ordersIsActive = false
  }

  private changeToOrdersInShopTabDashboard(): void {
    this.myDataIsActive = false
    this.ordersAssignedToMeIsActive = false
    this.ordersInShopIsActive = true
    this.ordersInShippingIsActive = false
    this.employeesIsActive = false
    this.productsIsActive = false
    this.ordersIsActive = false
  }

  private changeToOrdersInShippingTabDashboard(): void {
    this.myDataIsActive = false
    this.ordersAssignedToMeIsActive = false
    this.ordersInShopIsActive = false
    this.ordersInShippingIsActive = true
    this.employeesIsActive = false
    this.productsIsActive = false
    this.ordersIsActive = false
  }

  private changeToEmployeesTabDashboard(): void {
    this.myDataIsActive = false
    this.ordersAssignedToMeIsActive = false
    this.ordersInShopIsActive = false
    this.ordersInShippingIsActive = false
    this.employeesIsActive = true
    this.productsIsActive = false
    this.ordersIsActive = false
  }

  private changeToProductsTabDashboard(): void {
    this.myDataIsActive = false
    this.ordersAssignedToMeIsActive = false
    this.ordersInShopIsActive = false
    this.ordersInShippingIsActive = false
    this.employeesIsActive = false
    this.productsIsActive = true
    this.ordersIsActive = false
  }

  private changeToOrdersTabDashboard(): void {
    this.myDataIsActive = false
    this.ordersAssignedToMeIsActive = false
    this.ordersInShopIsActive = false
    this.ordersInShippingIsActive = false
    this.employeesIsActive = false
    this.productsIsActive = false
    this.ordersIsActive = true
  }

  private listenToResetDashboardState(): void {
    this.stateService.resetDashboardStateSubject.
    pipe(takeUntilDestroyed()).
    subscribe(_ => {
      this.myDataIsActive = true
      this.ordersAssignedToMeIsActive = false
      this.ordersInShopIsActive = false
      this.ordersInShippingIsActive = false
      this.employeesIsActive = false
      this.productsIsActive = false
      this.ordersIsActive = false
    })
  }
}
