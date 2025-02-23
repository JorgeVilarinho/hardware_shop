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
import { OrdersAssignmentComponent } from './components/orders-assignment/orders-assignment.component';
import { AssignOrderComponent } from './components/assign-order/assign-order.component';
import { OrdersAssignedToEmployeeComponent } from './components/orders-assigned-to-employee/orders-assigned-to-employee.component';
import { OrdersInShippingComponent } from './components/orders-in-shipping/orders-in-shipping.component';
import { OrdersInShopComponent } from './components/orders-in-shop/orders-in-shop.component';
import { ProductsDashboardComponent } from './components/products-dashboard/products-dashboard.component';
import { UpdateProductComponent } from './components/update-product/update-product.component';
import { AddProductComponent } from './components/add-product/add-product.component';

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
        path: 'products', component: ProductsDashboardComponent
      },
      {
        path: 'products/add', component: AddProductComponent
      },
      {
        path: 'products/:id', component: UpdateProductComponent
      },
      {
        path: 'employees/add', component: AddEmployeeComponent
      },
      {
        path: 'employee/:id', component: UpdateEmployeeComponent
      },
      {
        path: 'employee/:id/orders', component: OrdersAssignedToEmployeeComponent
      },
      {
        path: 'data', component: UpdateMyDataEmployeeComponent 
      },
      {
        path: 'orders', component: OrdersAssignmentComponent
      },
      {
        path: 'orders/:orderId/assign', component: AssignOrderComponent
      },
      {
        path: 'orders/in-shop', component: OrdersInShopComponent
      },
      {
        path: 'employee/:id/orders/in-shipping', component: OrdersInShippingComponent
      }
    ]
  },
  {
    path: '', redirectTo: 'home', pathMatch: 'full'
  }
];
