import { CategoriesService } from './../../services/categories.service';
import { AuthenticationService } from './../../services/authentication.service';
import { UserService } from './../../services/user.service';
import { Cart } from './../../models/cart.model';
import { Component, inject, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatBadgeModule } from '@angular/material/badge';
import { MatSidenavModule } from '@angular/material/sidenav';
import { Router, RouterLink } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { CartService } from '../../services/cart.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CurrencyPipe } from '@angular/common';
import { LogoutService } from '../../services/logout.service';
import { StateService } from '../../services/state.service';
import { Product } from '../../models/product.model';
import { PcProduct } from '../../models/pcProduct.model';
import { CategoryValue } from '../../models/categoryValue.model';
import { Category } from '../../models/category.model';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-header',
  imports: [ MatToolbarModule, MatIconModule, MatButtonModule, MatBadgeModule,
    MatSidenavModule, RouterLink, MatMenuModule, CurrencyPipe ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  router = inject(Router)
  authenticationService = inject(AuthenticationService);
  stateService = inject(StateService);
  cartService = inject(CartService);
  userService = inject(UserService);
  logOutService = inject(LogoutService);
  categoriesService = inject(CategoriesService);

  cart: Cart = {
    items: [],
    pcs: []
  };
  isLoggedIn: boolean = false;
  boxCategory: Category | undefined

  constructor() {
    this.listeToProductsInCart();
    this.listenToUserIsLoggedIn();
    this.listenToLogOut();
  }

  async ngOnInit(): Promise<void> {
    this.boxCategory = await this.categoriesService.getCategoryByValue(CategoryValue.PC_TOWERS_AND_ENCLOSURES)
  }

  private listeToProductsInCart(): void {
    this.cartService.productsInCart.
    pipe(takeUntilDestroyed())
    .subscribe(_cart => this.cart = _cart);
  }

  private listenToUserIsLoggedIn(): void {
    this.authenticationService.userIsLoggedInSubject.
    pipe(takeUntilDestroyed())
    .subscribe(_isLoggedIn => this.isLoggedIn = _isLoggedIn);
  }

  private listenToLogOut(): void {
    this.logOutService.logOutSubject
    .pipe(takeUntilDestroyed())
    .subscribe(_logOut => {
      if(_logOut) this.authenticationService.logOutUser();
    })
  }

  public getImage(imageFile: string): string {
    return environment.apiImageUrl + imageFile
  }

  public changeOpenedState(): void {
    this.stateService.menuOpened.next(!this.stateService.menuOpened.value);
  }

  public getTotal(): number {
    return this.cartService.getTotal()
  }

  public processCheckout(): void {
    if(!this.authenticationService.isLoggedIn()) {
      this.router.navigate(['login']);
      return
    }

    this.router.navigate(['checkout']);
  }

  public isClient(): boolean {
    return this.authenticationService.isClient()
  }

  public isEmployee(): boolean {
    return this.authenticationService.isEmployee()
  }

  public getBox(pcProduct: PcProduct): Product | undefined {
    return pcProduct.components.find(x => x.category == this.boxCategory?.nombre)
  }

  public someComponentHasDiscount(pcProduct: PcProduct): boolean {
    return pcProduct.components.some(x => x.discount > 0)
  }

  public getTotalWithoutDiscount(pcProduct: PcProduct): number {
    return pcProduct.components
    .map(component => component.price)
    .reduce((previous, current) => previous + current, 0)
  }

  public getTotalWithDiscount(pcProduct: PcProduct): number {
    return pcProduct.components
    .map(component => component.discount ? component.price * (100 - component.discount) / 100 : component.price)
    .reduce((previous, current) => previous + current, 0)
  }
}
