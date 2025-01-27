import { OrdersService } from './../../services/orders.service';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterLink } from '@angular/router';
import { Order } from '../../models/order.model';
import { MatDialog } from '@angular/material/dialog';
import { PaymentDialogComponent } from '../../components/payment-dialog/payment-dialog.component';

@Component({
  selector: 'app-payment',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css'
})
export class PaymentComponent {
  cardNumberRegex = /[0-9]{12}/i
  expireDateRegex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/i
  securityCodeRegex = /^[0-9]{3}$/i
  order: Order

  formBuilder = inject(FormBuilder)
  snackBar = inject(MatSnackBar)
  dialog = inject(MatDialog)
  ordersService = inject(OrdersService)

  paymentForm = this.formBuilder.group({
    cardHolder: ['', Validators.required],
    cardNumber: ['', [ Validators.required, Validators.pattern(this.cardNumberRegex) ]],
    expireDate: ['', [ Validators.required, Validators.pattern(this.expireDateRegex) ]],
    securityCode: ['', [ Validators.required, Validators.pattern(this.securityCodeRegex) ]]
  })
  isSubmited = false

  constructor(private router: Router) {
    this.order = this.router.getCurrentNavigation()?.extras.state!['order']
  }

  public invalidCardHolder(): boolean {
    return this.paymentForm.get('cardHolder')!.invalid && 
    (this.paymentForm.get('cardHolder')!.dirty || this.paymentForm.get('cardHolder')!.touched || this.isSubmited)
  }

  public invalidCardNumber(): boolean {
    return this.paymentForm.get('cardNumber')!.invalid && 
    (this.paymentForm.get('cardNumber')!.dirty || this.paymentForm.get('cardNumber')!.touched || this.isSubmited)
  }

  public invalidExpireDate(): boolean {
    return this.paymentForm.get('expireDate')!.invalid && 
    (this.paymentForm.get('expireDate')!.dirty || this.paymentForm.get('expireDate')!.touched || this.isSubmited)
  }

  public invalidSecurityCode(): boolean {
    return this.paymentForm.get('securityCode')!.invalid && 
    (this.paymentForm.get('securityCode')!.dirty || this.paymentForm.get('securityCode')!.touched || this.isSubmited)
  }

  public cardHolderHasRequiredError(): boolean {
    return this.paymentForm.get('cardHolder')!.hasError('required') && (this.paymentForm.get('cardHolder')!.dirty
    || this.paymentForm.get('cardHolder')!.touched || this.isSubmited);
  }

  public cardNumberHasRequiredError(): boolean {
    return this.paymentForm.get('cardNumber')!.hasError('required') && (this.paymentForm.get('cardNumber')!.dirty
    || this.paymentForm.get('cardNumber')!.touched || this.isSubmited);
  }

  public cardNumberHasPatternError(): boolean {
    return this.paymentForm.get('cardNumber')!.hasError('pattern') && (this.paymentForm.get('cardNumber')!.dirty
    || this.paymentForm.get('cardNumber')!.touched || this.isSubmited);
  }

  public expireDateHasRequiredError(): boolean {
    return this.paymentForm.get('expireDate')!.hasError('required') && (this.paymentForm.get('expireDate')!.dirty
    || this.paymentForm.get('expireDate')!.touched || this.isSubmited);
  }

  public expireDateHasPatternError(): boolean {
    return this.paymentForm.get('expireDate')!.hasError('pattern') && (this.paymentForm.get('expireDate')!.dirty
    || this.paymentForm.get('expireDate')!.touched || this.isSubmited);
  }

  public expireDateHasValueError(): boolean {
    if(!this.expireDateHasPatternError()) {
      let splitValues = this.paymentForm.get('expireDate')!.value!.split('/')
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
    return this.paymentForm.get('securityCode')!.hasError('required') && (this.paymentForm.get('securityCode')!.dirty
    || this.paymentForm.get('securityCode')!.touched || this.isSubmited);
  }

  public securityCodeHasPatternError(): boolean {
    return this.paymentForm.get('securityCode')!.hasError('pattern') && (this.paymentForm.get('securityCode')!.dirty
    || this.paymentForm.get('securityCode')!.touched || this.isSubmited);
  }

  public async onSubmit(): Promise<void> {
    if(this.paymentForm.valid) {
      let order = await this.ordersService.processOrderPayment(this.order.id)

      if(order) {
        const dialogRef = this.dialog.open(PaymentDialogComponent)
        dialogRef.componentInstance.order = order
        dialogRef.componentInstance.orderId = this.order.id
        return
      }

      const dialogRef = this.dialog.open(PaymentDialogComponent)
      dialogRef.componentInstance.orderId = this.order.id
    } else {
      this.snackBar.open('Los campos introducidos son inválidos', 'Ok', { duration: 3000 })
    }

    this.isSubmited = true
  }
}
