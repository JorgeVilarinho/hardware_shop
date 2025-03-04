import { CategoriesService } from './../../services/categories.service';
import { CurrencyPipe, NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';
import { PcConfiguratorService } from '../../services/pc-configurator.service';
import { CategoryValue } from '../../models/categoryValue.model';

@Component({
  selector: 'app-initial-pc-configurator',
  imports: [ MatIcon, NgClass, CurrencyPipe ],
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

  public createOrder(): void {
    // TODO
  }
}
