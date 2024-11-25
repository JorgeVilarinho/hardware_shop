import { NgClass } from '@angular/common';
import { AfterContentInit, AfterViewInit, Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-orders',
  imports: [ NgClass, RouterOutlet, RouterLink ],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent implements AfterViewInit {
  activeOrdersIsActive = true;
  canceledOrdersIsActive = false;
  router = inject(Router);

  changeActiveTab(tab: string): void {
    switch(tab) {
      case 'activeOrders':
        this.activeOrdersIsActive = true;
        this.canceledOrdersIsActive = false;
        this.router.navigate(['account/orders/active']);
        break;
      case 'canceledOrders':
        this.activeOrdersIsActive = false;
        this.canceledOrdersIsActive = true;
        this.router.navigate(['account/orders/canceled']);
    }
  }

  ngAfterViewInit(): void {
    this.router.navigate(['account/orders/active']);
  }
}
