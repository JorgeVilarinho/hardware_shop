import { ShippingMethod } from './../../models/shippingMethod.model';
import { CheckoutService } from './../../services/checkout.service';
import { Component, inject, OnInit } from '@angular/core';
import { CheckoutSteps } from '../../models/checkout-steps.model';
import { RouterOutlet } from '@angular/router';
import { Address } from '../../models/address.model';
import { UserService } from '../../services/user.service';
import { Product } from '../../models/product.model';
import { CartService } from '../../services/cart.service';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ShippingOption } from '../../models/shippingOption.model';
import { PaymentOption } from '../../models/paymentOption.model';
import { MatDialog } from '@angular/material/dialog';
import { AdditionalInfoDialogComponent } from '../../components/additional-info-dialog/additional-info-dialog.component';
import { ShippingMethodValue } from '../../models/shippingMethodValue.model';
import { PaymentOptionValue } from '../../models/paymentOptionValue.models';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { OrderRepository } from '../../models/orderRepository.model';
import { OrdersService } from '../../services/orders.service';
import { PaymentDialogComponent } from '../../components/payment-dialog/payment-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-checkout',
  imports: [ ReactiveFormsModule, MatProgressSpinnerModule, RouterOutlet ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit {
  cardNumberRegex = /[0-9]{12}/i
  expireDateRegex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/i
  securityCodeRegex = /^[0-9]{3}$/i

  checkoutSteps: CheckoutSteps
  addresses: Address[] = []
  cartProducts: Product[] = []
  shippingMethods: ShippingMethod[] = []
  shippingOptions: ShippingOption[] = []
  paymentOptions: PaymentOption[] = []
  order: OrderRepository | null = null
  isLoading = false
  checkOutFormSubmitted = false
  total = 0

  userService = inject(UserService)
  cartService = inject(CartService)
  checkoutService = inject(CheckoutService)
  ordersService = inject(OrdersService)
  formBuilder = inject(FormBuilder)
  dialog = inject(MatDialog)
  snackBar = inject(MatSnackBar)

  selectionForm = this.formBuilder.group({
    shippingMethod: new FormControl<ShippingMethod | null>(null, Validators.required),
    address: new FormControl<Address | null>(null, Validators.required),
    shippingOption: new FormControl<ShippingOption | null>(null, Validators.required)
  })

  paymentForm = this.formBuilder.group({
    paymentOption: new FormControl<PaymentOption | null>(null, Validators.required)
  })

  checkOutForm = this.formBuilder.group({
    cardHolder: ['', Validators.required],
    cardNumber: ['', [ Validators.required, Validators.pattern(this.cardNumberRegex) ]],
    expireDate: ['', [ Validators.required, Validators.pattern(this.expireDateRegex) ]],
    securityCode: ['', [ Validators.required, Validators.pattern(this.securityCodeRegex) ]]
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

  public getCartTotal(): number {
    return this.cartService.getTotal()
  }

  public getTotalWithTax(): number {
    if(this.shippingOptionIsSelected()) {
      return (this.cartService.getTotal() + this.getShippingOptionCost()!) * 1.21
    }

    return this.cartService.getTotalWithTax()
  }

  private getShippingMethod(): ShippingMethod {
    return this.selectionForm.get('shippingMethod')?.value!
  }

  public getShippingMethodDescription(): string | undefined {
    return this.selectionForm.get('shippingMethod')?.value?.descripcion;
  }

  private getShippingOption(): ShippingOption {
    return this.selectionForm.get('shippingOption')?.value!
  }

  public getShippingOptionDescription(): string | undefined {
    return this.selectionForm.get('shippingOption')?.value?.descripcion;
  }

  private getPaymentOption(): PaymentOption {
    return this.paymentForm.get('paymentOption')!.value!
  }

  public getPaymentOptionDescription(): string | undefined {
    return this.paymentForm.get('paymentOption')!.value?.descripcion;
  }

  public getPaymentOptionAddtionalInformation(): string | undefined {
    return this.paymentForm.get('paymentOption')?.value?.informacion_adicional;
  }

  private getAddress(): Address {
    return this.selectionForm.get('address')?.value!
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

  public invalidCardHolder(): boolean {
    return this.checkOutForm.get('cardHolder')!.invalid && 
    (this.checkOutForm.get('cardHolder')!.dirty || this.checkOutForm.get('cardHolder')!.touched || this.checkOutFormSubmitted)
  }

  public invalidCardNumber(): boolean {
    return this.checkOutForm.get('cardNumber')!.invalid && 
    (this.checkOutForm.get('cardNumber')!.dirty || this.checkOutForm.get('cardNumber')!.touched || this.checkOutFormSubmitted)
  }

  public invalidExpireDate(): boolean {
    return this.checkOutForm.get('expireDate')!.invalid && 
    (this.checkOutForm.get('expireDate')!.dirty || this.checkOutForm.get('expireDate')!.touched || this.checkOutFormSubmitted)
  }

  public invalidSecurityCode(): boolean {
    return this.checkOutForm.get('securityCode')!.invalid && 
    (this.checkOutForm.get('securityCode')!.dirty || this.checkOutForm.get('securityCode')!.touched || this.checkOutFormSubmitted)
  }

  public cardHolderHasRequiredError(): boolean {
    return this.checkOutForm.get('cardHolder')!.hasError('required') && (this.checkOutForm.get('cardHolder')!.dirty
    || this.checkOutForm.get('cardHolder')!.touched || this.checkOutFormSubmitted);
  }

  public cardNumberHasRequiredError(): boolean {
    return this.checkOutForm.get('cardNumber')!.hasError('required') && (this.checkOutForm.get('cardNumber')!.dirty
    || this.checkOutForm.get('cardNumber')!.touched || this.checkOutFormSubmitted);
  }

  public cardNumberHasPatternError(): boolean {
    return this.checkOutForm.get('cardNumber')!.hasError('pattern') && (this.checkOutForm.get('cardNumber')!.dirty
    || this.checkOutForm.get('cardNumber')!.touched || this.checkOutFormSubmitted);
  }

  public expireDateHasRequiredError(): boolean {
    return this.checkOutForm.get('expireDate')!.hasError('required') && (this.checkOutForm.get('expireDate')!.dirty
    || this.checkOutForm.get('expireDate')!.touched || this.checkOutFormSubmitted);
  }

  public expireDateHasPatternError(): boolean {
    return this.checkOutForm.get('expireDate')!.hasError('pattern') && (this.checkOutForm.get('expireDate')!.dirty
    || this.checkOutForm.get('expireDate')!.touched || this.checkOutFormSubmitted);
  }

  public expireDateHasValueError(): boolean {
    if(!this.expireDateHasPatternError()) {
      let splitValues = this.checkOutForm.get('expireDate')!.value!.split('/')
      let month = +splitValues[0]
      let year = +splitValues[1]

      const date = new Date()
      const currentYear = +date.getFullYear().toString().slice(-2)
      if(year < currentYear) return true
      if(year == currentYear && month - 1 <= date.getMonth()) return true
      return false
    }

    return false
  }

  public securityCodeHasRequiredError(): boolean {
    return this.checkOutForm.get('securityCode')!.hasError('required') && (this.checkOutForm.get('securityCode')!.dirty
    || this.checkOutForm.get('securityCode')!.touched || this.checkOutFormSubmitted);
  }

  public securityCodeHasPatternError(): boolean {
    return this.checkOutForm.get('securityCode')!.hasError('pattern') && (this.checkOutForm.get('securityCode')!.dirty
    || this.checkOutForm.get('securityCode')!.touched || this.checkOutFormSubmitted);
  }

  public async onSubmit(): Promise<void> {
      if(this.paymentForm.valid) {
        let order = await this.ordersService.processOrderPayment(this.order!.id)
  
        if(order) {
          const dialogRef = this.dialog.open(PaymentDialogComponent)
          dialogRef.componentInstance.order = order
          dialogRef.componentInstance.orderId = this.order!.id
          return
        }
  
        const dialogRef = this.dialog.open(PaymentDialogComponent)
        dialogRef.componentInstance.orderId = this.order!.id
      } else {
        this.snackBar.open('Los campos introducidos son inválidos', 'Ok', { duration: 3000 })
      }
  
      this.checkOutFormSubmitted = true
    }
}
