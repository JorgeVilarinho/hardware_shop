import { CheckoutService } from './../../services/checkout.service';
import { Component, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { PaymentOption } from '../../models/paymentOption.model';
import { PaymentOptionValue } from '../../models/paymentOptionValue.models';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { OrdersService } from '../../services/orders.service';
import { PaymentDialogComponent } from '../payment-dialog/payment-dialog.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { OrderRepository } from '../../models/orderRepository.model';
import { CurrencyPipe } from '@angular/common';
import { ShippingMethod } from '../../models/shippingMethod.model';

@Component({
  selector: 'app-process-order',
  imports: [ MatIcon, ReactiveFormsModule, RouterLink, CurrencyPipe ],
  templateUrl: './process-order.component.html',
  styleUrl: './process-order.component.css',
})
export class ProcessOrderComponent {
  cardNumberRegex = /[0-9]{12}/i;
  expireDateRegex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/i;
  securityCodeRegex = /^[0-9]{3}$/i;

  order: OrderRepository | null = null;
  paymentOption: PaymentOption | null = null;
  shippingMethod: ShippingMethod | null = null;
  total = 0
  checkOutFormSubmitted = false;

  checkoutService = inject(CheckoutService)
  ordersService = inject(OrdersService)
  formBuilder = inject(FormBuilder)
  snackBar = inject(MatSnackBar)
  dialog = inject(MatDialog)

  checkOutForm = this.formBuilder.group({
    cardHolder: ['', Validators.required],
    cardNumber: [
      '',
      [Validators.required, Validators.pattern(this.cardNumberRegex)],
    ],
    expireDate: [
      '',
      [Validators.required, Validators.pattern(this.expireDateRegex)],
    ],
    securityCode: [
      '',
      [Validators.required, Validators.pattern(this.securityCodeRegex)],
    ],
  });

  constructor() {
    this.listenToChangePaymentOption()
    this.listenToCreateOrder()
    this.listenToChangeShippingMethod()
    this.listenToChangeTotal()
  }

  public paymentOptionIsCreditCard(): boolean {
    return this.paymentOption?.valor == PaymentOptionValue.CREDIT_CARD;
  }

  public invalidCardHolder(): boolean {
    return (
      this.checkOutForm.get('cardHolder')!.invalid &&
      (this.checkOutForm.get('cardHolder')!.dirty ||
        this.checkOutForm.get('cardHolder')!.touched ||
        this.checkOutFormSubmitted)
    );
  }

  public invalidCardNumber(): boolean {
    return (
      this.checkOutForm.get('cardNumber')!.invalid &&
      (this.checkOutForm.get('cardNumber')!.dirty ||
        this.checkOutForm.get('cardNumber')!.touched ||
        this.checkOutFormSubmitted)
    );
  }

  public invalidExpireDate(): boolean {
    return (
      this.checkOutForm.get('expireDate')!.invalid &&
      (this.checkOutForm.get('expireDate')!.dirty ||
        this.checkOutForm.get('expireDate')!.touched ||
        this.checkOutFormSubmitted)
    );
  }

  public invalidSecurityCode(): boolean {
    return (
      this.checkOutForm.get('securityCode')!.invalid &&
      (this.checkOutForm.get('securityCode')!.dirty ||
        this.checkOutForm.get('securityCode')!.touched ||
        this.checkOutFormSubmitted)
    );
  }

  public cardHolderHasRequiredError(): boolean {
    return (
      this.checkOutForm.get('cardHolder')!.hasError('required') &&
      (this.checkOutForm.get('cardHolder')!.dirty ||
        this.checkOutForm.get('cardHolder')!.touched ||
        this.checkOutFormSubmitted)
    );
  }

  public cardNumberHasRequiredError(): boolean {
    return (
      this.checkOutForm.get('cardNumber')!.hasError('required') &&
      (this.checkOutForm.get('cardNumber')!.dirty ||
        this.checkOutForm.get('cardNumber')!.touched ||
        this.checkOutFormSubmitted)
    );
  }

  public cardNumberHasPatternError(): boolean {
    return (
      this.checkOutForm.get('cardNumber')!.hasError('pattern') &&
      (this.checkOutForm.get('cardNumber')!.dirty ||
        this.checkOutForm.get('cardNumber')!.touched ||
        this.checkOutFormSubmitted)
    );
  }

  public expireDateHasRequiredError(): boolean {
    return (
      this.checkOutForm.get('expireDate')!.hasError('required') &&
      (this.checkOutForm.get('expireDate')!.dirty ||
        this.checkOutForm.get('expireDate')!.touched ||
        this.checkOutFormSubmitted)
    );
  }

  public expireDateHasPatternError(): boolean {
    return (
      this.checkOutForm.get('expireDate')!.hasError('pattern') &&
      (this.checkOutForm.get('expireDate')!.dirty ||
        this.checkOutForm.get('expireDate')!.touched ||
        this.checkOutFormSubmitted)
    );
  }

  public expireDateHasValueError(): boolean {
    if (!this.expireDateHasPatternError()) {
      let splitValues = this.checkOutForm.get('expireDate')!.value!.split('/');
      let month = +splitValues[0];
      let year = +splitValues[1];

      const date = new Date();
      const currentYear = +date.getFullYear().toString().slice(-2);
      if (year < currentYear) return true;
      if (year == currentYear && month - 1 <= date.getMonth()) return true;
      return false;
    }

    return false;
  }

  public securityCodeHasRequiredError(): boolean {
    return (
      this.checkOutForm.get('securityCode')!.hasError('required') &&
      (this.checkOutForm.get('securityCode')!.dirty ||
        this.checkOutForm.get('securityCode')!.touched ||
        this.checkOutFormSubmitted)
    );
  }

  public securityCodeHasPatternError(): boolean {
    return (
      this.checkOutForm.get('securityCode')!.hasError('pattern') &&
      (this.checkOutForm.get('securityCode')!.dirty ||
        this.checkOutForm.get('securityCode')!.touched ||
        this.checkOutFormSubmitted)
    );
  }

  public getShippingMethodDescription(): string | undefined {
    return this.shippingMethod?.descripcion
  }

  public getPaymentOptionDescription(): string | undefined {
    return this.paymentOption?.descripcion
  }

  public getPaymentOptionAddtionalInformation(): string | undefined {
    return this.paymentOption?.informacion_adicional
  }

  public async onSubmit(): Promise<void> {
    if (this.paymentOption) {
      let order = await this.ordersService.processOrderPayment(this.order!.id);

      if (order) {
        const dialogRef = this.dialog.open(PaymentDialogComponent);
        dialogRef.componentInstance.order = order;
        dialogRef.componentInstance.orderId = this.order!.id;
        return;
      }

      const dialogRef = this.dialog.open(PaymentDialogComponent);
      dialogRef.componentInstance.orderId = this.order!.id;
    } else {
      this.snackBar.open('Los campos introducidos son inválidos', 'Ok', {
        duration: 3000,
      });
    }

    this.checkOutFormSubmitted = true;
  }

  private listenToChangePaymentOption(): void {
    this.checkoutService.changePaymentOption$
    .pipe(takeUntilDestroyed())
    .subscribe(paymentOption => this.paymentOption = paymentOption)
  }

  private listenToCreateOrder(): void {
    this.checkoutService.createOrder$
    .pipe(takeUntilDestroyed())
    .subscribe(order => this.order = order)
  }

  private listenToChangeShippingMethod(): void {
    this.checkoutService.changeShippingMethod$
    .pipe(takeUntilDestroyed())
    .subscribe(shippingMethod => this.shippingMethod = shippingMethod)
  }

  private listenToChangeTotal(): void {
    this.checkoutService.changeTotalWithTax$
    .pipe(takeUntilDestroyed())
    .subscribe(total => this.total = total)
  }
}
