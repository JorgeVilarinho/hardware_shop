import { Injectable } from '@angular/core';
import { CategoryValue } from '../models/categoryValue.model';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class PcConfiguratorService {
  private components = new Map<CategoryValue, Product>()
  private assembly = false

  constructor() { }

  public addProduct(key: CategoryValue, value: Product) {
    this.components.set(key, value)
  }

  public exists(key: string) {
    return this.components.has(key as CategoryValue)
  }

  public getProduct(key: string) {
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
}
