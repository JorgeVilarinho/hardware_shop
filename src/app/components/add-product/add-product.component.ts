import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { Category } from '../../models/category.model';
import { Brand } from '../../models/brand.model';
import { CategoriesService } from '../../services/categories.service';
import { BrandsService } from '../../services/brands.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ImagesService } from '../../services/images.service';
import { ProductsService } from '../../services/products.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-add-product',
  imports: [ MatIcon, RouterLink, ReactiveFormsModule ],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.css'
})
export class AddProductComponent implements OnInit {
  categories: Category[] = []
  brands: Brand[] = []
  selectedFile: Blob | null = null

  productsService = inject(ProductsService);
  categoriesService = inject(CategoriesService);
  brandsService = inject(BrandsService);
  imagesService = inject(ImagesService);
  formBuilder = inject(FormBuilder);
  snackBar = inject(MatSnackBar);
  router = inject(Router);

  addProductForm = this.formBuilder.group({
    name: new FormControl<string>('', Validators.required),
    description: new FormControl<string>('', [ Validators.required, Validators.maxLength(800) ]),
    price: new FormControl<number>(0, [ Validators.required, Validators.min(0) ]),
    units: new FormControl<number>(0, [ Validators.required, Validators.min(0) ]),
    discount: new FormControl<number>(0, [ Validators.required, Validators.min(0), Validators.max(100) ]),
    category: new FormControl<number>(0, Validators.required),
    brand: new FormControl<number>(0, Validators.required)
  });
  isSubmitted = false

  async ngOnInit(): Promise<void> {
    this.categories = await this.categoriesService.getCategories()
  }

  public getImage(imageFile: string): string {
    return environment.apiImageUrl + imageFile;
  }

  public onImageSelected(event: Event): void {
    const target = event.target as HTMLInputElement

    this.selectedFile = target.files![0]
    let productImage = document.querySelector('#productImage') as HTMLImageElement
    productImage.src = URL.createObjectURL(this.selectedFile)
  }

  public async selectCategory(event: Event): Promise<void> {
    let input = event.target as HTMLSelectElement
  
    let categoryId = input.value as unknown as number;
    this.brands = await this.brandsService.getBrandsByCategory(categoryId)
    // Update brand value to first element in brands array to no create conflicts when updating the data
    this.addProductForm.get('brand')!.setValue(this.brands[0].id)
  }

  public nameHasRequiredError(): boolean | undefined {
    return this.addProductForm.get('name')?.hasError('required') && (this.addProductForm.get('name')?.dirty
    || this.addProductForm.get('name')?.touched || this.isSubmitted);
  }

  public descriptionHasRequiredError(): boolean | undefined {
    return this.addProductForm.get('description')?.hasError('required') && (this.addProductForm.get('description')?.dirty
    || this.addProductForm.get('description')?.touched || this.isSubmitted);
  }

  public descriptionHasMaxLengthError(): boolean | undefined {
    return this.addProductForm.get('description')?.hasError('maxLength') && (this.addProductForm.get('description')?.dirty
    || this.addProductForm.get('description')?.touched || this.isSubmitted);
  }

  public priceHasRequiredError(): boolean | undefined {
    return this.addProductForm.get('price')?.hasError('required') && (this.addProductForm.get('price')?.dirty
    || this.addProductForm.get('price')?.touched || this.isSubmitted);
  }

  public priceHasMinError(): boolean | undefined {
    return this.addProductForm.get('price')?.hasError('min') && (this.addProductForm.get('price')?.dirty
    || this.addProductForm.get('price')?.touched || this.isSubmitted);
  }

  public unitsHasRequiredError(): boolean | undefined {
    return this.addProductForm.get('units')?.hasError('required') && (this.addProductForm.get('units')?.dirty
    || this.addProductForm.get('units')?.touched || this.isSubmitted);
  }

  public unitsHasMinError(): boolean | undefined {
    return this.addProductForm.get('units')?.hasError('min') && (this.addProductForm.get('units')?.dirty
    || this.addProductForm.get('units')?.touched || this.isSubmitted);
  }

  public discountHasRequiredError(): boolean | undefined {
    return this.addProductForm.get('discount')?.hasError('required') && (this.addProductForm.get('discount')?.dirty
    || this.addProductForm.get('discount')?.touched || this.isSubmitted);
  }

  public discountHasMinError(): boolean | undefined {
    return this.addProductForm.get('discount')?.hasError('min') && (this.addProductForm.get('discount')?.dirty
    || this.addProductForm.get('discount')?.touched || this.isSubmitted);
  }

  public discountHasMaxError(): boolean | undefined {
    return this.addProductForm.get('discount')?.hasError('max') && (this.addProductForm.get('discount')?.dirty
    || this.addProductForm.get('discount')?.touched || this.isSubmitted);
  }

  public categoryHasRequiredError(): boolean | undefined {
    return this.addProductForm.get('category')?.hasError('required') && (this.addProductForm.get('category')?.dirty
    || this.addProductForm.get('category')?.touched || this.isSubmitted);
  }

  public brandHasRequiredError(): boolean | undefined {
    return this.addProductForm.get('brand')?.hasError('required') && (this.addProductForm.get('brand')?.dirty
    || this.addProductForm.get('brand')?.touched || this.isSubmitted);
  }

  public async onSubmit(): Promise<void> {
    if(this.addProductForm.valid) {
      if(!this.selectedFile) {
        this.snackBar.open('Se debe de seleccionar una foto para el producto', 'Ok', { duration: 3000 });
        return
      }

      await this.imagesService.uploadImage(this.selectedFile)

      const response = await this.productsService.addProduct(
        this.addProductForm.get('name')!.value!,
        this.addProductForm.get('description')!.value!,
        this.addProductForm.get('price')!.value!,
        this.addProductForm.get('units')!.value!,
        this.addProductForm.get('discount')!.value!,
        this.addProductForm.get('category')!.value!,
        this.addProductForm.get('brand')!.value!,
        (this.selectedFile as File).name
      )

      if(response.ok) {
        this.snackBar.open('Se ha añadido correctamente el producto', 'Ok', { duration: 3000 })
        this.router.navigate(['/dashboard/products'])
      } 
    } else {
      this.snackBar.open("Los campos introducidos no son válidos", 'Ok', { duration: 3000 });
    }

    this.isSubmitted = true
  }
}
