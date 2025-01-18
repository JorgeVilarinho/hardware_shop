import { ShippingMethod } from './../../models/shippingMethod.model';
import { CheckoutService } from './../../services/checkout.service';
import { Component, inject, OnInit } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { CheckoutSteps } from '../../models/checkout-steps.model';
import { RouterLink } from '@angular/router';
import { Address } from '../../models/address.model';
import { UserService } from '../../services/user.service';
import { Product } from '../../models/product.model';
import { CartService } from '../../services/cart.service';
import { CurrencyPipe } from '@angular/common';
import { AbstractControl, FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ShippingOption } from '../../models/shippingOption.model';

@Component({
  selector: 'app-checkout',
  imports: [ MatIcon, RouterLink, CurrencyPipe, ReactiveFormsModule ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit {
  checkoutSteps: CheckoutSteps
  addresses: Address[] = []
  cartProducts: Product[] = []
  shippingMethods: ShippingMethod[] = []
  shippingOptions: ShippingOption[] = []

  userService = inject(UserService)
  cartService = inject(CartService)
  checkoutService = inject(CheckoutService)
  formBuilder = inject(FormBuilder)

  selectionForm = this.formBuilder.group({
    shippingMethod: new FormControl<ShippingMethod | null>(null, Validators.required),
    address: new FormControl<Address | null>(null, Validators.required),
    shippingOption: new FormControl<ShippingOption | null>(null, Validators.required)
  })

  constructor() {
    this.checkoutSteps = CheckoutSteps.SELECTION
  }

  async ngOnInit(): Promise<void> {
    this.addresses = await this.userService.getAddresses()
    this.shippingMethods = await this.checkoutService.getShippingMethods()
    this.shippingOptions = await this.checkoutService.getShippingOptions()
    this.cartProducts = this.cartService.getItems()
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
    if(this.shippingOptionIsSelected()) {
      return this.cartService.getTotalWithTax() + this.getShippingOptionCost()!
    }

    return this.cartService.getTotalWithTax()
  }

  public getShippingMethodDescription(): string | undefined {
    return this.selectionForm.get('shippingMethod')?.value?.descripcion;
  } 

  public getShippingOptionDescription(): string | undefined {
    return this.selectionForm.get('shippingOption')?.value?.descripcion;
  }

  public getAddressName(): string | undefined {
    return this.selectionForm.get('address')?.value?.nombre;
  }

  private getAddressDirection(): string | undefined {
    return this.selectionForm.get('address')?.value?.direccion;
  }

  private getAddressProvince(): string | undefined {
    return this.selectionForm.get('address')?.value?.provincia;
  }

  private getAddressCity(): string | undefined {
    return this.selectionForm.get('address')?.value?.ciudad;
  }

  private getAddressPhone(): string | undefined {
    return this.selectionForm.get('address')?.value?.telefono;
  }

  public getAddressDescription(): string {
    if(this.selectionForm.get('address')?.value) {
      return `${this.getAddressDirection()}, ${this.getAddressProvince() }, ${this.getAddressCity() }, Tel:${ this.getAddressPhone() }`
    }

    return ''
  }

  public shippingOptionIsSelected(): boolean {
    return this.selectionForm.get('shippingOption')!.value as unknown as boolean;
  }

  public getShippingOptionCost(): number | undefined {
    return this.selectionForm.get('shippingOption')?.value?.coste;
  }
}
