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
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ShippingOption } from '../../models/shippingOption.model';
import { PaymentOption } from '../../models/paymentOption.model';
import { MatDialog } from '@angular/material/dialog';
import { AdditionalInfoDialogComponent } from '../../components/additional-info-dialog/additional-info-dialog.component';
import { ShippingMethodValue } from '../../models/shippingMethodValue.model';
import { PaymentOptionValue } from '../../models/paymentOptionValue.models';

@Component({
  selector: 'app-checkout',
  imports: [ MatIcon, RouterLink, CurrencyPipe, ReactiveFormsModule, MatIcon ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit {
  checkoutSteps: CheckoutSteps
  addresses: Address[] = []
  cartProducts: Product[] = []
  shippingMethods: ShippingMethod[] = []
  shippingOptions: ShippingOption[] = []
  paymentOptions: PaymentOption[] = []

  userService = inject(UserService)
  cartService = inject(CartService)
  checkoutService = inject(CheckoutService)
  formBuilder = inject(FormBuilder)
  dialog = inject(MatDialog)

  selectionForm = this.formBuilder.group({
    shippingMethod: new FormControl<ShippingMethod | null>(null, Validators.required),
    address: new FormControl<Address | null>(null, Validators.required),
    shippingOption: new FormControl<ShippingOption | null>(null, Validators.required)
  })

  paymentForm = this.formBuilder.group({
    paymentOption: new FormControl<PaymentOption | null>(null, Validators.required)
  })

  constructor() {
    this.checkoutSteps = CheckoutSteps.SELECTION
  }

  async ngOnInit(): Promise<void> {
    this.cartProducts = this.cartService.getItems()
    this.addresses = await this.userService.getAddresses()
    this.shippingMethods = await this.checkoutService.getShippingMethods()
    this.shippingOptions = await this.checkoutService.getShippingOptions()
    this.paymentOptions = await this.checkoutService.getPaymentOptions()
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

  public getPaymentOptionDescription(): string | undefined {
    return this.paymentForm.get('paymentOption')!.value?.descripcion;
  }

  public getPaymentOptionAddtionalInformation(): string | undefined {
    return this.paymentForm.get('paymentOption')?.value?.informacion_adicional;
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
      return `${this.getAddressDirection()}, ${this.getAddressProvince() }, ${this.getAddressCity() }, Tel:${this.getAddressPhone()}`
    }

    return ''
  }

  public paymentOptionIsCreditCard(): boolean {
    console.log(this.paymentForm.get('paymentOption')?.value?.valor)
    console.log(PaymentOptionValue.CREDIT_CARD)
    return this.paymentForm.get('paymentOption')?.value?.valor == PaymentOptionValue.CREDIT_CARD
  }

  public shippingMethodIsHomeDelivery(): boolean {
    return this.selectionForm.get('shippingMethod')!.value?.valor == ShippingMethodValue.HOME_DELIVERY
  }

  public shippingMethodIsShopPickUp(): boolean {
    return this.selectionForm.get('shippingMethod')!.value?.valor == ShippingMethodValue.SHOP_PICKUP
  }

  public shippingOptionIsSelected(): boolean {
    return this.selectionForm.get('shippingOption')!.value as unknown as boolean;
  }

  public paymentOptionIsSelected(): boolean {
    return this.paymentForm.get('paymentOption')!.value as unknown as boolean;
  }

  public getShippingOptionCost(): number | undefined {
    return this.selectionForm.get('shippingOption')?.value?.coste;
  }

  public selectionFormIsValid(): boolean {
    if(this.selectionForm.get('shippingMethod')!.value?.valor == ShippingMethodValue.HOME_DELIVERY) {
      return this.selectionForm.get('address')!.value as unknown as boolean &&  this.selectionForm.get('shippingOption')!.value as unknown as boolean
    }

    if(this.selectionForm.get('shippingMethod')!.value?.valor == ShippingMethodValue.SHOP_PICKUP) {
      return true
    }

    return false
  }

  public onChangeShippingMethod(): void {
    this.selectionForm.get('address')!.setValue(null) 
    this.selectionForm.get('shippingOption')!.setValue(null) 
  }

  public openAddtionalInfoPopUp(paymentOption: PaymentOption): void {
    const dialogRef = this.dialog.open(AdditionalInfoDialogComponent);
    dialogRef.componentInstance.paymentOption = paymentOption;
  }
}
