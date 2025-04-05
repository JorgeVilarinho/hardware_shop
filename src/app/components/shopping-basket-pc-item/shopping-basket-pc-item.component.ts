import { Component, inject, Input, OnInit } from '@angular/core';
import { Pc } from '../../models/pc.model';
import { CartService } from '../../services/cart.service';
import { LocalStorageService } from '../../services/local-storage.service';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Category } from '../../models/category.model';
import { CategoriesService } from '../../services/categories.service';
import { CategoryValue } from '../../models/categoryValue.model';
import { Product } from '../../models/product.model';
import { CurrencyPipe } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-shopping-basket-pc-item',
  imports: [ CurrencyPipe, MatIcon ],
  templateUrl: './shopping-basket-pc-item.component.html',
  styleUrl: './shopping-basket-pc-item.component.css'
})
export class ShoppingBasketPcItemComponent implements OnInit {
  @Input() pcItem: Pc | undefined;
  cartService = inject(CartService)
  localStorage = inject(LocalStorageService)
  categoriesService = inject(CategoriesService)
  httpClient = inject(HttpClient)
  snackBar = inject(MatSnackBar)

  boxCategory: Category | undefined
  box: Product | undefined

  constructor() {}
  
  async ngOnInit(): Promise<void> {
    this.boxCategory = await this.categoriesService.getCategoryByValue(CategoryValue.PC_TOWERS_AND_ENCLOSURES)
    this.box = this.getBox(this.pcItem)
  }

  public getImage(imageFile: string | undefined): string {
    if(!imageFile) return environment.apiImageUrl + 'default_pc.png'

    return environment.apiImageUrl + imageFile
  }

  public getBox(pcProduct: Pc | undefined): Product | undefined {
    return pcProduct!.components.find(x => x.category == this.boxCategory?.nombre)
  }

  public someComponentHasDiscount(pcProduct: Pc | undefined): boolean {
    if(!pcProduct) return false

    return pcProduct.components.some(x => x.discount > 0)
  }

  public getTotalWithoutDiscount(pcProduct: Pc | undefined): number {
    if(!pcProduct) return 0

    return pcProduct.components
    .map(component => component.price)
    .reduce((previous, current) => previous + current, 0)
  }

  public getTotalWithDiscount(pcProduct: Pc | undefined): number {
    if(!pcProduct) return 0

    return pcProduct.components
    .map(component => component.discount ? component.price * (100 - component.discount) / 100 : component.price)
    .reduce((previous, current) => previous + current, 0)
  }

  public removePcProduct(): void {
    this.cartService.removePcProduct(this.pcItem!.id);
  }
}
