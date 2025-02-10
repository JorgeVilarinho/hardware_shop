import { ActiveOrdersComponent } from './components/active-orders/active-orders.component';
import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { AccountComponent } from './pages/account/account.component';
import { OrdersComponent } from './components/orders/orders.component';
import { CanceledOrdersComponent } from './components/canceled-orders/canceled-orders.component';
import { AddressComponent } from './components/address/address.component';
import { UserDataComponent } from './components/user-data/user-data.component';
import { ShoppingBasketComponent } from './pages/shopping-basket/shopping-basket.component';
import { ProductComponent } from './pages/product/product.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { OrderComponent } from './components/order/order.component';
import { PaymentComponent } from './pages/payment/payment.component';
import { PaymentDataComponent } from './components/payment-data/payment-data.component';
import { ShippingDataComponent } from './components/shipping-data/shipping-data.component';
import { ProcessOrderComponent } from './components/process-order/process-order.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { EmployeesComponent } from './components/employees/employees.component';
import { AddEmployeeComponent } from './components/add-employee/add-employee.component';
import { UpdateEmployeeComponent } from './components/update-employee/update-employee.component';
import { UpdateMyDataEmployeeComponent } from './components/update-my-data-employee/update-my-data-employee.component';

export const routes: Routes = [
  {
    path: 'home', component: HomeComponent
  },
  {
    path: 'login', component: LoginComponent
  },
  {
    path: 'register', component: RegisterComponent
  },
  {
    path: 'account', component: AccountComponent, children: [
      {
        path: 'orders', component: OrdersComponent, children: [
          {
            path: 'active', component: ActiveOrdersComponent
          },
          {
            path: 'canceled', component: CanceledOrdersComponent
          }
        ]
      },
      {
        path: 'address', component: AddressComponent
      },
      {
        path: 'data', component: UserDataComponent
      },
      {
        path: 'orders/:id', component: OrderComponent
      }
    ]
  },
  {
    path: 'shopping-basket', component: ShoppingBasketComponent
  },
  {
    path: 'product', component: ProductComponent
  },
  {
    path: 'checkout', component: CheckoutComponent, children: [
      {
        path: '', component: ShippingDataComponent
      },
      {
        path: 'payment-data', component: PaymentDataComponent
      },
      {
        path: 'process-order', component: ProcessOrderComponent
      }
    ]
  },
  {
    path: 'payment', component: PaymentComponent
  },
  {
    path: 'dashboard', component: DashboardComponent, children: [
      {
        path: 'employees', component: EmployeesComponent
      },
      {
        path: 'employees/add', component: AddEmployeeComponent
      },
      {
        path: 'employee/:id', component: UpdateEmployeeComponent
      },
      {
        path: 'data', component: UpdateMyDataEmployeeComponent 
      }
    ]
  },
  {
    path: '', redirectTo: 'home', pathMatch: 'full'
  }
];
