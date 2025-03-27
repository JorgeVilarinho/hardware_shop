import { PcConfiguratorService } from './../../services/pc-configurator.service';
import { BrandsService } from './../../services/brands.service';
import { CategoriesService } from './../../services/categories.service';
import { Component, inject, OnInit } from '@angular/core';
import { Category } from '../../models/category.model';
import { ProductsService } from '../../services/products.service';
import { CategoryValue } from '../../models/categoryValue.model';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Product } from '../../models/product.model';
import { Filters } from '../../models/filters.model';
import { CurrencyPipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormControl, Validators } from '@angular/forms';
import { OrderBy } from '../../models/orderBy.model';
import { Brand } from '../../models/brand.model';
import { CompatibilityValue } from '../../models/compatibilityValue.model';
import { MatIcon } from '@angular/material/icon';
import { environment } from '../../../environments/environment';

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
  filters: Filters = {
    orderBy: OrderBy.LOWER_PRICE,
    minPrice: 0,
    brands: []
  }

  productsService = inject(ProductsService)
  categoriesService = inject(CategoriesService)
  brandsService = inject(BrandsService)
  pcConfiguratorService = inject(PcConfiguratorService)
  formBuilder = inject(FormBuilder)
  snackBar = inject(MatSnackBar)
  router = inject(Router)

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
    this.filters.category = this.category;

    this.products = await this.productsService.getProductsWithFiltersAsync(this.filters)
    this.brands = await this.brandsService.getBrandsByCategory(this.category!.id)
  }

  public getImage(imageFile: string): string {
    return environment.apiImageUrl + imageFile
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

  public async onChangeBrand(): Promise<void> {
    let brandId = this.productSelectionForm.get('brand')?.value as number

    if(brandId == 0) {
      this.filters.brands = []
    } else {
      let brand = this.brands.find(x => x.id == brandId)!
      this.filters.brands = [ brand ]
    }
    
    this.products = await this.productsService.getProductsWithFiltersAsync(this.filters)
  }

  public async onChangeOrderBy(): Promise<void> {
    let orderBy = this.productSelectionForm.get('orderBy')?.value as OrderBy
    this.filters.orderBy = orderBy
    this.products = await this.productsService.getProductsWithFiltersAsync(this.filters)
  }

  public onChangeCompatibility(): void {
    let compatibilityValue = this.productSelectionForm.get('compatibility')?.value
    console.log(compatibilityValue)
  }

  public async onInputSearchByText(): Promise<void> {
    let text = this.productSelectionForm.get('searchByText')?.value

    if(text && text.length >= 3) {
      this.filters.searchByText = text
    } else {
      this.filters.searchByText = undefined
    }

    this.products = await this.productsService.getProductsWithFiltersAsync(this.filters)
  }

  public getCategoryName(): string | undefined {
    return this.category?.nombre
  }

  public onSubmit(): void {
    if(this.productSelectionForm.valid) {
      this.pcConfiguratorService.addProduct(this.categoryValue!, this.selectedProduct!)
      this.router.navigate(['/configurator'])
    } else {
      this.snackBar.open('Se necesitan enviar los datos obligatorios', 'Ok', { duration: 3000 })
    }

    this.isSubmitted = true
  }

  
}
