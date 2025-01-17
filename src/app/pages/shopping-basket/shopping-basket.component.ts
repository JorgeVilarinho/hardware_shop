import { AuthenticationService } from './../../services/authentication.service';
import { Component, inject } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { MatIcon } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { ShoppingBasketItemComponent } from "../../components/shopping-basket-item/shopping-basket-item.component";
import { CurrencyPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-shopping-basket',
  imports: [ MatIcon, RouterModule, ShoppingBasketItemComponent, CurrencyPipe ],
  templateUrl: './shopping-basket.component.html',
  styleUrl: './shopping-basket.component.css'
})
export class ShoppingBasketComponent {
  cartService = inject(CartService)
  authenticationService = inject(AuthenticationService)
  router = inject(Router)
  httpClient = inject(HttpClient)

  public removeAllItems(): void {
    this.cartService.removeAllItems();
  }

  public getTotal(): number {
    return this.cartService.getTotal();
  }

  public getTaxImport(): number {
    return this.cartService.getTaxImport()
  }

  public getTotalWithTax(): number {
    return this.cartService.getTotalWithTax();
  }

  public processCheckout(): void {
    if(!this.authenticationService.isLoggedIn()) {
      this.router.navigate(['login']);
      return
    }

    this.router.navigate(['checkout']);
  }
}
