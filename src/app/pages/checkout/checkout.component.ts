import { Component, inject, OnInit } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { CheckoutSteps } from '../../models/checkout-steps.model';
import { RouterLink } from '@angular/router';
import { Address } from '../../models/address.model';
import { UserService } from '../../services/user.service';
import { Product } from '../../models/product.model';
import { CartService } from '../../services/cart.service';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-checkout',
  imports: [ MatIcon, RouterLink, CurrencyPipe ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit {
  checkoutSteps: CheckoutSteps
  addresses: Address[] = []
  cartProducts: Product[] = []

  userService = inject(UserService)
  cartService = inject(CartService)

  constructor() {
    this.checkoutSteps = CheckoutSteps.SELECTION
  }

  async ngOnInit(): Promise<void> {
    this.addresses = await this.userService.getAddresses()
    this.cartProducts = this.cartService.getItems();
  }

  public changeToPaymentStep(): void {
    this.checkoutSteps = CheckoutSteps.PAYMENT
  }

  public changeToProcessOrderStep(): void {
    this.checkoutSteps = CheckoutSteps.PROCESS_ORDER
  }

  public getCartTotal(): number {
    return this.cartService.getTotal()
  }

  public getTotalWithTax(): number {
    return this.cartService.getTotalWithTax()
  }
}
