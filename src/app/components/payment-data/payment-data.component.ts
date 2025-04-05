import { CartService } from './../../services/cart.service';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { PaymentOption } from '../../models/paymentOption.model';
import { CheckoutService } from '../../services/checkout.service';
import { MatDialog } from '@angular/material/dialog';
import { AdditionalInfoDialogComponent } from '../additional-info-dialog/additional-info-dialog.component';
import { OrderRepository } from '../../models/orderRepository.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Product } from '../../models/product.model';
import { ShippingMethod } from '../../models/shippingMethod.model';
import { ShippingOption } from '../../models/shippingOption.model';
import { Address } from '../../models/address.model';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { CurrencyPipe } from '@angular/common';
import { ShippingMethodValue } from '../../models/shippingMethodValue.model';
import { Router } from '@angular/router';
import { Pc } from '../../models/pc.model';
import { Category } from '../../models/category.model';
import { CategoriesService } from '../../services/categories.service';
import { CategoryValue } from '../../models/categoryValue.model';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-payment-data',
  imports: [ MatIcon, ReactiveFormsModule, MatProgressSpinner, CurrencyPipe ],
  templateUrl: './payment-data.component.html',
  styleUrl: './payment-data.component.css'
})
export class PaymentDataComponent implements OnInit {
  paymentOptions: PaymentOption[] = []
  cartProducts: Product[] = []
  pcs: Pc[] = []
  shippingMethod: ShippingMethod | null = null
  shippingOption: ShippingOption | null = null
  paymentOption: PaymentOption | null = null
  address: Address | null = null
  order: OrderRepository | null = null
  boxCategory: Category | undefined
  isLoading = false
  total = 0

  checkoutService = inject(CheckoutService)
  cartService = inject(CartService)
  categoriesService = inject(CategoriesService)
  formBuilder = inject(FormBuilder)
  dialog = inject(MatDialog)
  router = inject(Router)
  
  paymentForm = this.formBuilder.group({
    paymentOption: new FormControl<PaymentOption | null>(null, Validators.required)
  })

  constructor() {
    this.listenToChangeTotalWithTax()
    this.listenToChangeShippingMethod()
    this.listenToChangeShippingOption()
    this.listenToChangeAddress()
  }

  async ngOnInit(): Promise<void> {
    this.paymentOptions = await this.checkoutService.getPaymentOptions()
    this.cartProducts = this.cartService.getItems()
    this.pcs = this.cartService.getPcs()
    this.boxCategory = await this.categoriesService.getCategoryByValue(CategoryValue.PC_TOWERS_AND_ENCLOSURES)
  }

  public getImage(imageFile: string | undefined): string {
    return environment.apiImageUrl + imageFile
  }

  public openAddtionalInfoPopUp(paymentOption: PaymentOption): void {
    const dialogRef = this.dialog.open(AdditionalInfoDialogComponent);
    dialogRef.componentInstance.paymentOption = paymentOption;
  }

  public paymentOptionIsSelected(): boolean {
    return this.paymentForm.get('paymentOption')!.value as unknown as boolean;
  }

  public async processOrderAndChangeToProcessOrderStep(): Promise<void> {
    this.isLoading = true

    await new Promise(resolve => setInterval(resolve, 1500))
    
    this.order = await this.checkoutService.createOrder(
      this.cartProducts, this.pcs, this.shippingMethod!, 
      this.shippingOption!, this.getPaymentOption(), this.total, this.address!)
    this.checkoutService.createOrderSubject.next(this.order)
    this.cartService.removeAllItems();
  
    this.isLoading = false
    this.router.navigate([`/checkout/process-order/${this.order?.id}`])
  }

  public getTotalItems(): number {
    return this.cartProducts.length + this.pcs.length 
  }

  public getCartTotal(): number {
    return this.cartService.getTotal()
  }

  public shippingOptionIsSelected(): boolean {
    return this.shippingOption as unknown as boolean
  }

  public getShippingOptionCost(): number | undefined {
    return this.shippingOption?.coste;
  }

  public shippingMethodIsShopPickUp(): boolean {
    return this.shippingMethod?.valor == ShippingMethodValue.SHOP_PICKUP
  }

  public shippingMethodIsSelected(): boolean {
    return this.shippingMethod as unknown as boolean;
  }

  public addressIsSelected(): boolean {
    return this.address as unknown as boolean;
  }

  public getTotalWithTax(): number {
    if(this.shippingOptionIsSelected()) {
      return (this.cartService.getTotal() + this.getShippingOptionCost()!) * 1.21
    }

    return this.cartService.getTotalWithTax()
  }

  public getShippingMethodDescription(): string | undefined {
    return this.shippingMethod?.descripcion
  }

  public getShippingOptionDescription(): string | undefined {
    return this.shippingOption?.descripcion
  }

  public getAddressName(): string | undefined {
    return this.address?.nombre
  }

  public getAddressDescription(): string {
    if(this.address) {
      return `${this.getAddressDirection()}, ${this.getAddressProvince() }, ${this.getAddressCity() }, Tel:${this.getAddressPhone()}`
    }

    return ''
  }

  public onChangePaymentOption(paymentOption: PaymentOption): void {
    this.checkoutService.changePaymentOptionSubject.next(paymentOption)
  }

  public getBox(pcProduct: Pc): Product | undefined {
    return pcProduct.components.find(x => x.category == this.boxCategory?.nombre)
  }

  public someComponentHasDiscount(pcProduct: Pc): boolean {
    return pcProduct.components.some(x => x.discount > 0)
  }

  public getTotalWithoutDiscount(pcProduct: Pc): number {
    return pcProduct.components
    .map(component => component.price)
    .reduce((previous, current) => previous + current, 0)
  }

  public getTotalWithDiscount(pcProduct: Pc): number {
    return pcProduct.components
    .map(component => component.discount ? component.price * (100 - component.discount) / 100 : component.price)
    .reduce((previous, current) => previous + current, 0)
  }

  private getAddressDirection(): string | undefined {
    return this.address?.direccion
  }

  private getAddressProvince(): string | undefined {
    return this.address?.provincia
  }

  private getAddressCity(): string | undefined {
    return this.address?.ciudad
  }

  private getAddressPhone(): string | undefined {
    return this.address?.telefono
  }

  private getPaymentOption(): PaymentOption {
    return this.paymentForm.get('paymentOption')!.value!
  }

  private listenToChangeTotalWithTax(): void {
    this.checkoutService.changeTotalWithTax$
    .pipe(takeUntilDestroyed())
    .subscribe(total => this.total = total)
  }

  private listenToChangeShippingMethod(): void {
    this.checkoutService.changeShippingMethod$
    .pipe(takeUntilDestroyed())
    .subscribe(shippingMethod => this.shippingMethod = shippingMethod)
  }

  private listenToChangeShippingOption(): void {
    this.checkoutService.changeShippingOption$
    .pipe(takeUntilDestroyed())
    .subscribe(shippingOption => this.shippingOption = shippingOption)
  }

  private listenToChangeAddress(): void {
    this.checkoutService.changeAddress$
    .pipe(takeUntilDestroyed())
    .subscribe(address => this.address = address)
  }
}
