import { LocalStorageService } from './../../services/local-storage.service';
import { CartService } from './../../services/cart.service';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { ShippingMethod } from '../../models/shippingMethod.model';
import { Address } from '../../models/address.model';
import { ShippingOption } from '../../models/shippingOption.model';
import { CurrencyPipe } from '@angular/common';
import { UserService } from '../../services/user.service';
import { CheckoutService } from '../../services/checkout.service';
import { ShippingMethodValue } from '../../models/shippingMethodValue.model';
import { RouterModule } from '@angular/router';
import { Product } from '../../models/product.model';
import { Pc } from '../../models/pc.model';
import { Category } from '../../models/category.model';
import { CategoriesService } from '../../services/categories.service';
import { CategoryValue } from '../../models/categoryValue.model';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-shipping-data',
  imports: [ MatIcon, ReactiveFormsModule, CurrencyPipe, RouterModule ],
  templateUrl: './shipping-data.component.html',
  styleUrl: './shipping-data.component.css'
})
export class ShippingDataComponent implements OnInit {
  addresses: Address[] = []
  shippingMethods: ShippingMethod[] = []
  shippingOptions: ShippingOption[] = []
  cartProducts: Product[] = []
  pcs: Pc[] = []
  boxCategory: Category | undefined

  userService = inject(UserService)
  checkoutService = inject(CheckoutService)
  cartService = inject(CartService)
  categoriesService = inject(CategoriesService)
  localStorageService = inject(LocalStorageService)
  formBuilder = inject(FormBuilder)

  selectionForm = this.formBuilder.group({
    shippingMethod: new FormControl<ShippingMethod | null>(null, Validators.required),
    address: new FormControl<Address | null>(null, Validators.required),
    shippingOption: new FormControl<ShippingOption | null>(null, Validators.required)
  })

  async ngOnInit(): Promise<void> {
    this.addresses = await this.userService.getAddresses()
    this.shippingMethods = await this.checkoutService.getShippingMethods()
    this.shippingOptions = await this.checkoutService.getShippingOptions()
    this.cartProducts = this.cartService.getItems()
    this.pcs = this.cartService.getPcs()
    this.boxCategory = await this.categoriesService.getCategoryByValue(CategoryValue.PC_TOWERS_AND_ENCLOSURES)
  }

  public getImage(imageFile: string | undefined): string {
    return environment.apiImageUrl + imageFile
  }

  public onChangeShippingMethod(): void {
    this.localStorageService.setItem('shippingMethod', JSON.stringify(this.selectionForm.get('shippingMethod')?.value!))

    this.selectionForm.get('address')!.setValue(null)
    if(this.localStorageService.getItem('address')) this.localStorageService.removeItem('address')

    this.selectionForm.get('shippingOption')!.setValue(null)
    if(this.localStorageService.getItem('shippingOption')) this.localStorageService.removeItem('shippingOption')
  }

  public onChangeShippingOption(shippingOption: ShippingOption): void {
    this.localStorageService.setItem('shippingOption', JSON.stringify(shippingOption))
  }

  public onChangeAddressOption(address: Address): void {
    this.localStorageService.setItem('address', JSON.stringify(address))
  }

  public shippingMethodIsHomeDelivery(): boolean {
    return this.selectionForm.get('shippingMethod')!.value?.valor == ShippingMethodValue.HOME_DELIVERY
  }

  public selectionFormIsValid(): boolean {
    if(this.selectionForm.get('shippingMethod')!.value?.valor == ShippingMethodValue.HOME_DELIVERY) {
      return this.selectionForm.get('address')!.value as unknown as boolean && this.selectionForm.get('shippingOption')!.value as unknown as boolean
    }

    if(this.selectionForm.get('shippingMethod')!.value?.valor == ShippingMethodValue.SHOP_PICKUP) {
      return true
    }

    return false
  }

  public getTotalItems(): number {
    return this.cartProducts.length + this.pcs.length 
  }

  public getCartTotal(): number {
    return this.cartService.getTotal()
  }

  public shippingOptionIsSelected(): boolean {
    return this.selectionForm.get('shippingOption')!.value as unknown as boolean;
  }

  public shippingMethodIsSelected(): boolean {
    return this.selectionForm.get('shippingMethod')!.value as unknown as boolean;
  }

  public addressIsSelected(): boolean {
    return this.selectionForm.get('address')!.value as unknown as boolean;
  }

  public getShippingOptionCost(): number | undefined {
    return this.selectionForm.get('shippingOption')?.value?.coste;
  }

  public shippingMethodIsShopPickUp(): boolean {
    return this.selectionForm.get('shippingMethod')!.value?.valor == ShippingMethodValue.SHOP_PICKUP
  }

  public getTotalWithTax(): number {
    let totalWithTax = 0

    if(this.shippingOptionIsSelected()) {
      totalWithTax = (this.cartService.getTotal() + this.getShippingOptionCost()!) * 1.21
      
      this.localStorageService.setItem('total', totalWithTax as unknown as string)
      return totalWithTax
    }

    totalWithTax = this.cartService.getTotalWithTax()

    this.localStorageService.setItem('total', totalWithTax as unknown as string)
    return totalWithTax
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

  public getAddressDescription(): string {
    if(this.selectionForm.get('address')?.value) {
      return `${this.getAddressDirection()}, ${this.getAddressProvince() }, ${this.getAddressCity() }, Tel: ${this.getAddressPhone()}`
    }

    return ''
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
}
