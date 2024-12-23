import { UserService } from './../../services/user.service';
import { Cart } from './../../models/cart.model';
import { Component, inject } from '@angular/core';
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
import { LogoutService } from '../../services/logout.service';

@Component({
  selector: 'app-header',
  imports: [ MatToolbarModule, MatIconModule, MatButtonModule, MatBadgeModule,
    MatSidenavModule, RouterLink, MatMenuModule, CurrencyPipe ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  stateService = inject(StateService);
  cartService = inject(CartService);
  userService = inject(UserService);
  logOutService = inject(LogoutService);

  cart: Cart = {
    items: []
  };
  isLoggedIn: boolean = false;

  constructor() {
    this.listeToProductsInCart();
    this.listenToUserIsLoggedIn();
    this.listenToLogOut();
  }

  private listeToProductsInCart(): void {
    this.cartService.productsInCart.
    pipe(takeUntilDestroyed())
    .subscribe(_cart => this.cart = _cart);
  }

  private listenToUserIsLoggedIn(): void {
    this.userService.userIsLoggedInSubject.
    pipe(takeUntilDestroyed())
    .subscribe(_isLoggedIn => this.isLoggedIn = _isLoggedIn);
  }

  private listenToLogOut(): void {
    this.logOutService.logOutSubject
    .pipe(takeUntilDestroyed())
    .subscribe(_logOut => {
      if(_logOut) this.userService.logOutUser();
    })
  }

  public changeOpenedState() {
    this.stateService.opened.next(!this.stateService.opened.value);
  }

  public getTotal(): number {
    return this.cartService.getTotal()
  }
}
