import { CategoriesService } from './../../services/categories.service';
import { CurrencyPipe, NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';
import { PcConfiguratorService } from '../../services/pc-configurator.service';
import { CategoryValue } from '../../models/categoryValue.model';
import { CartService } from '../../services/cart.service';
import { Pc } from '../../models/pc.model';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { PcData } from '../../models/pcData.model';

@Component({
  selector: 'app-initial-pc-configurator',
  imports: [ MatIcon, NgClass, CurrencyPipe, ReactiveFormsModule ],
  templateUrl: './initial-pc-configurator.component.html',
  styleUrl: './initial-pc-configurator.component.css'
})
export class InitialPcConfiguratorComponent {
  private SHIPPING_COSTS = 4.95

  componentsTabActive = true
  peripheralsTabActive = false
  assemblyTabActive = false

  router = inject(Router)
  categoriesService = inject(CategoriesService)
  pcConfiguratorService = inject(PcConfiguratorService)
  cartService = inject(CartService)
  formBuilder = inject(FormBuilder)

  assemblyForm = this.formBuilder.group({
    assembly: new FormControl<boolean>(false, Validators.required),
  })

  public getImage(imageFile: string | undefined): string {
    return environment.apiImageUrl + imageFile;
  }

  public changeActiveTabToComponentTab(): void {
    this.componentsTabActive = true
    this.peripheralsTabActive = false
    this.assemblyTabActive = false
  }

  public changeActiveTabToPeripheralsTab(): void {
    this.componentsTabActive = false
    this.peripheralsTabActive = true
    this.assemblyTabActive = false
  }

  public changeActiveTabToAssemblyTab(): void {
    this.componentsTabActive = false
    this.peripheralsTabActive = false
    this.assemblyTabActive = true
  }
  
  public goToProductSelectionByCategory(categoryValue: string): void {
    this.router.navigate([`/configurator/product-selection/${categoryValue}`])
  }

  public getTotal(): number {
    let components = this.pcConfiguratorService.getComponents()
    let total = 0

    if(components.length == 0) return total

    for(let i = 0; i < components.length; i++) {
      let component = components[i]

      if(component.discount > 0) {
        total += (component!.price * (100 - component!.discount)) / 100
      } else {
        total += component.price
      }
    }

    total += this.SHIPPING_COSTS

    return total
  }

  public hasBox(): boolean {
    return this.pcConfiguratorService.exists(CategoryValue.PC_TOWERS_AND_ENCLOSURES)
  }

  public getShippingCost(): number {
    return this.SHIPPING_COSTS
  }

  public onChangeAssembly(): void {
    this.pcConfiguratorService.changeAssembly(this.assemblyForm.get('assembly')?.value!) 
  }

  public isValidToAddToCart(): boolean {
    return this.pcConfiguratorService.isValidToAddToCart()
  }

  public addToCart(): void {
    let pcData: PcData = {
      components: this.pcConfiguratorService.getComponents(),
      assembly: this.pcConfiguratorService.getAssembly()
    }

    this.cartService.addPcProduct(pcData)
    this.resetFlagsAndForm()
  }

  private resetFlagsAndForm(): void {
    this.componentsTabActive = true
    this.peripheralsTabActive = false
    this.assemblyTabActive = false
    this.assemblyForm.get('assembly')!.setValue(false)
  }
}
