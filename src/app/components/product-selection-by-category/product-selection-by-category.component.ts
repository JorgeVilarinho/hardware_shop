import { BrandsService } from './../../services/brands.service';
import { CategoriesService } from './../../services/categories.service';
import { Component, inject, OnInit } from '@angular/core';
import { Category } from '../../models/category.model';
import { ProductsService } from '../../services/products.service';
import { CategoryValue } from '../../models/categoryValue.model';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Product } from '../../models/product.model';
import { Filters } from '../../models/filters.model';
import { CurrencyPipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormControl, Validators } from '@angular/forms';
import { OrderBy } from '../../models/orderBy.model';
import { Brand } from '../../models/brand.model';
import { CompatibilityValue } from '../../models/compatibilityValue.model';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-product-selection-by-category',
  imports: [ CurrencyPipe, ReactiveFormsModule, MatIcon ],
  templateUrl: './product-selection-by-category.component.html',
  styleUrl: './product-selection-by-category.component.css'
})
export class ProductSelectionByCategoryComponent implements OnInit {
  categoryValue: CategoryValue | null = null
  category: Category | undefined
  products: Product[] = []
  brands: Brand[] = []
  selectedProduct: Product | undefined

  productsService = inject(ProductsService)
  categoriesService = inject(CategoriesService)
  brandsService = inject(BrandsService)
  formBuilder = inject(FormBuilder)
  snackBar = inject(MatSnackBar)

  productSelectionForm = this.formBuilder.group({
    searchByText: new FormControl<string>(''),
    brand: new FormControl<number>(0, Validators.required),
    orderBy: new FormControl<OrderBy>(OrderBy.LOWER_PRICE, Validators.required),
    compatibility: new FormControl<CompatibilityValue>(CompatibilityValue.ALL, Validators.required),
    product: new FormControl<Product | null>(null, Validators.required)
  });
  isSubmitted = false

  constructor(private route: ActivatedRoute) {
    this.categoryValue = this.route.snapshot.paramMap.get('categoryValue') as CategoryValue
  }

  async ngOnInit(): Promise<void> {
    if(!this.categoryValue) {
      this.snackBar.open('No se ha recibido la categoría de los productos a buscar', 'Ok', { duration: 3000 })
      return
    }

    this.category = await this.categoriesService.getCategoryByValue(this.categoryValue)
    let filters: Filters = {
      orderBy: OrderBy.LOWER_PRICE,
      minPrice: 0,
      brands: []
    };

    this.products = await this.productsService.getProductsWithFiltersAsync(filters)
    this.brands = await this.brandsService.getBrandsByCategory(this.category!.id)
  }

  public getNumberOfResults(): number {
    return this.products.length
  }

  public onChangeProduct(product: Product): void {
    this.selectedProduct = product
  }

  public productIsSelected(): boolean {
    return this.selectedProduct as unknown as boolean
  }

  public onSubmit(): void {
    if(this.productSelectionForm.valid) {
      
    } else {
      this.snackBar.open('Se necesitan enviar los datos obligatorios', 'Ok', { duration: 3000 })
    }

    this.isSubmitted = true
  }

  
}
