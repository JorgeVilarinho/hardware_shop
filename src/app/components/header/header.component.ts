import { Cart } from './../../models/cart.model';
import { Component, inject, Injector } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatBadgeModule} from '@angular/material/badge';
import {MatSidenavModule} from '@angular/material/sidenav';
import { StateService } from '../../services/state.service';
import { RouterLink } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { CartService } from '../../services/cart.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [ MatToolbarModule, MatIconModule, MatButtonModule, MatBadgeModule,
    MatSidenavModule, RouterLink, MatMenuModule, CurrencyPipe ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  stateService: StateService = inject(StateService);
  cartService: CartService = inject(CartService);
  cart: Cart = {
    items: []
  };

  constructor() {
    this.cartService.productsInCart.
    pipe(takeUntilDestroyed())
    .subscribe((_cart) => this.cart = _cart);
  }

  changeOpenedState() {
    this.stateService.opened.next(!this.stateService.opened.value);
  }

  getTotal(): number {
    return this.cartService.getTotal()
  }
}
