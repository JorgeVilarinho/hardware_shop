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
      }
    ]
  },
  {
    path: '', redirectTo: 'home', pathMatch: 'full'
  }
];
