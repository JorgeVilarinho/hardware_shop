import { Component, inject, OnInit } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { Product } from '../../models/product.model';
import { ProductsService } from '../../services/products.service';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Category } from '../../models/category.model';
import { CategoriesService } from '../../services/categories.service';
import { Brand } from '../../models/brand.model';
import { BrandsService } from '../../services/brands.service';

@Component({
  selector: 'app-update-product',
  imports: [MatIcon, RouterLink, ReactiveFormsModule],
  templateUrl: './update-product.component.html',
  styleUrl: './update-product.component.css',
})
export class UpdateProductComponent implements OnInit {
  productId: string | null = null;
  product: Product | undefined;
  categories: Category[] = []
  brands: Brand[] = []
  selectedFile: File | null = null

  productsService = inject(ProductsService);
  categoriesService = inject(CategoriesService);
  brandsService = inject(BrandsService);
  formBuilder = inject(FormBuilder);

  updateProductForm = this.formBuilder.group({
    name: new FormControl<string>('', Validators.required),
    description: new FormControl<string>('', [ Validators.required, Validators.maxLength(800) ]),
    price: new FormControl<number>(0, [ Validators.required, Validators.min(0) ]),
    units: new FormControl<number>(0, [ Validators.required, Validators.min(0) ]),
    discount: new FormControl<number>(0, [ Validators.required, Validators.min(0), Validators.max(100) ]),
    category: new FormControl<number>(0, Validators.required),
    brand: new FormControl<number>(0, Validators.required)
  });
  isSubmitted = false

  constructor(private route: ActivatedRoute) {
    this.productId = this.route.snapshot.paramMap.get('id');
  }

  async ngOnInit(): Promise<void> {
    this.categories = await this.categoriesService.getCategories()
    this.brands = await this.brandsService.getBrands()
    this.product = await this.productsService.getProductById(this.productId!);
    await this.loadProductData()
  }

  public onImageSelected(event: Event): void {
    const target = event.target as HTMLInputElement

    this.selectedFile = target.files![0]
    let productImage = document.querySelector('#productImage') as HTMLImageElement
    productImage.src = URL.createObjectURL(this.selectedFile)
  }

  public nameHasRequiredError(): boolean | undefined {
    return this.updateProductForm.get('name')?.hasError('required') && (this.updateProductForm.get('name')?.dirty
    || this.updateProductForm.get('name')?.touched || this.isSubmitted);
  }

  public descriptionHasRequiredError(): boolean | undefined {
    return this.updateProductForm.get('description')?.hasError('required') && (this.updateProductForm.get('description')?.dirty
    || this.updateProductForm.get('description')?.touched || this.isSubmitted);
  }

  public descriptionHasMaxLengthError(): boolean | undefined {
    return this.updateProductForm.get('description')?.hasError('maxLength') && (this.updateProductForm.get('description')?.dirty
    || this.updateProductForm.get('description')?.touched || this.isSubmitted);
  }

  public priceHasRequiredError(): boolean | undefined {
    return this.updateProductForm.get('price')?.hasError('required') && (this.updateProductForm.get('price')?.dirty
    || this.updateProductForm.get('price')?.touched || this.isSubmitted);
  }

  public priceHasMinError(): boolean | undefined {
    return this.updateProductForm.get('price')?.hasError('min') && (this.updateProductForm.get('price')?.dirty
    || this.updateProductForm.get('price')?.touched || this.isSubmitted);
  }

  public unitsHasRequiredError(): boolean | undefined {
    return this.updateProductForm.get('units')?.hasError('required') && (this.updateProductForm.get('units')?.dirty
    || this.updateProductForm.get('units')?.touched || this.isSubmitted);
  }

  public unitsHasMinError(): boolean | undefined {
    return this.updateProductForm.get('units')?.hasError('min') && (this.updateProductForm.get('units')?.dirty
    || this.updateProductForm.get('units')?.touched || this.isSubmitted);
  }

  public discountHasRequiredError(): boolean | undefined {
    return this.updateProductForm.get('discount')?.hasError('required') && (this.updateProductForm.get('discount')?.dirty
    || this.updateProductForm.get('discount')?.touched || this.isSubmitted);
  }

  public discountHasMinError(): boolean | undefined {
    return this.updateProductForm.get('discount')?.hasError('min') && (this.updateProductForm.get('discount')?.dirty
    || this.updateProductForm.get('discount')?.touched || this.isSubmitted);
  }

  public discountHasMaxError(): boolean | undefined {
    return this.updateProductForm.get('discount')?.hasError('max') && (this.updateProductForm.get('discount')?.dirty
    || this.updateProductForm.get('discount')?.touched || this.isSubmitted);
  }

  public categoryHasRequiredError(): boolean | undefined {
    return this.updateProductForm.get('category')?.hasError('required') && (this.updateProductForm.get('category')?.dirty
    || this.updateProductForm.get('category')?.touched || this.isSubmitted);
  }

  public brandHasRequiredError(): boolean | undefined {
    return this.updateProductForm.get('brand')?.hasError('required') && (this.updateProductForm.get('brand')?.dirty
    || this.updateProductForm.get('brand')?.touched || this.isSubmitted);
  }

  public async loadProductData(): Promise<void> {
    const category = await this.categoriesService.getCategoryByValue(this.product?.category!)
    const brand = await this.brandsService.getBrandByValue(this.product?.brand!)

    this.updateProductForm.get('name')!.setValue(this.product?.name ?? '')
    this.updateProductForm.get('description')!.setValue(this.product?.description ?? '')
    this.updateProductForm.get('price')!.setValue(this.product?.price ?? 0)
    this.updateProductForm.get('units')!.setValue(this.product?.units ?? 0)
    this.updateProductForm.get('discount')!.setValue(this.product?.discount ?? 0)
    this.updateProductForm.get('category')!.setValue(category?.id ?? 0)
    this.updateProductForm.get('brand')!.setValue(brand?.id ?? 0)
  }

  public onSubmit(): void {
    // TODO: Update product data
  }
}
