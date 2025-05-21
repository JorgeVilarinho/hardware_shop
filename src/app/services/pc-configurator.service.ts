import { Injectable } from '@angular/core';
import { CategoryValue } from '../models/categoryValue.model';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class PcConfiguratorService {
  private components = new Map<CategoryValue, Product>()
  private assembly = false
  private mandatoryComponentsToAdd = [
    CategoryValue.PROCESSORS, 
    CategoryValue.MOTHERBOARDS, 
    CategoryValue.RAM, 
    CategoryValue.PC_TOWERS_AND_ENCLOSURES
  ]

  constructor() { }

  public addProduct(key: CategoryValue, value: Product): void {
    this.components.set(key, value)
  }

  public exists(key: string): boolean {
    return this.components.has(key as CategoryValue)
  }

  public getProduct(key: string): Product | undefined {
    return this.components.get(key as CategoryValue)
  }

  public getTotalComponents(): number {
    return this.components.size
  }

  public getComponents(): Product[] {
    return [...this.components.values()] 
  }

  public getAssembly(): boolean {
    return this.assembly
  }

  public clearProduct(): void {
    this.components.clear()
    this.assembly = false
  }

  public changeAssembly(value: boolean): void {
    this.assembly = value
  }

  public isValidToAddToCart(): boolean {
    for(let i = 0; i < this.mandatoryComponentsToAdd.length; i++) {
      const mandatoryComponent = this.mandatoryComponentsToAdd[i]

      if(!this.components.has(mandatoryComponent)) return false
    }

    return true
  }
}
