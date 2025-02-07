import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [ NgClass, RouterModule ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  employeesIsActive = true
  ordersIsActive = false

  router = inject(Router)

  constructor(private route: ActivatedRoute) {}

  public changeSelectedOption(menu: string): void {
    switch(menu) {
      case 'employees': 
        this.employeesIsActive = true
        this.ordersIsActive = false
        this.router.navigate(['employees'], { relativeTo: this.route })
        break
      case 'orders':
        this.employeesIsActive = false
        this.ordersIsActive = true
    }
  }
}
