import { CategoriesService } from './../../services/categories.service';
import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-initial-pc-configurator',
  imports: [ MatIcon, NgClass ],
  templateUrl: './initial-pc-configurator.component.html',
  styleUrl: './initial-pc-configurator.component.css'
})
export class InitialPcConfiguratorComponent {
  componentsTabActive = true
  peripheralsTabActive = false
  assemblyTabActive = false

  router = inject(Router)
  categoriesService = inject(CategoriesService)

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
}
