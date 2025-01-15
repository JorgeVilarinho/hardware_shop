import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion'
import { MatSliderModule } from '@angular/material/slider';
import { Category } from '../../models/category.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { Brand } from '../../models/brand.model';
import { CurrencyPipe } from '@angular/common';
import { Filters } from '../../models/filters.model';
import { OrderBy } from '../../models/orderBy.model';
import { ProductsService } from '../../services/products.service';
import { ReactiveFormsModule } from '@angular/forms';
import { StateService } from '../../services/state.service';

@Component({
  selector: 'app-filters-sidenav',
  imports: [ MatIconModule, MatButtonModule, MatExpansionModule, MatSliderModule, CurrencyPipe, ReactiveFormsModule ],
  templateUrl: './filters-sidenav.component.html',
  styleUrl: './filters-sidenav.component.css'
})
export class FiltersSidenavComponent implements OnInit {
  httpClient = inject(HttpClient)
  stateService = inject(StateService)
  productsService = inject(ProductsService)
  
  minPriceValue = 0;
  maxPriceValue: number | undefined;
  maxLimit: number | undefined;
  categories: Category[] = [];
  brands: Brand[] = [];
  filters: Filters = {
    orderBy: OrderBy.LOWER_PRICE,
    minPrice: 0,
    brands: []
  };

  constructor() {
    this.getCategories();
    this.getBrands();
  }

  async ngOnInit(): Promise<void> {
    let maxPrice = await this.productsService.getMaxPrice();

    // If is a float we truncate and add one more unit 
    // else if is an integer we don't do anything
    if(maxPrice % 1 !== 0) {
      this.maxLimit = Math.trunc(maxPrice) + 1;
    } else {
      this.maxLimit = maxPrice;
    }

    this.maxPriceValue = this.maxLimit;
  }

  public selectCategory(category: Category): void {
    if(this.filters.category !== undefined && this.filters.category.id === category.id) {
      return
    }

    this.changeBrands(this.categories.find(x => x.id == category.id)!);
    this.filters.brands = [];
    this.filters.category = category;
  }

  public upsertBrandToFilters(brand: Brand): void {
    const brandIndex = this.filters.brands.findIndex(x => x.id == brand.id);

    if(brandIndex == -1) {
      this.filters.brands.push(brand);
    } else {
      this.filters.brands.splice(brandIndex, 1);
    }
  }

  public selectOrderBy(event: Event): void {
    let input = event.target as HTMLSelectElement

    let orderBy = input.value as unknown as OrderBy;
    this.filters.orderBy = orderBy;
  }

  public minValueChanged(event: Event): void {
    let input = event.target as HTMLInputElement;

    this.minPriceValue = +input.value;
    this.filters.minPrice = this.minPriceValue;
  }

  public maxValueChanged(event: Event): void {
    let input = event.target as HTMLInputElement;

    this.maxPriceValue = +input.value;
    this.filters.maxPrice = this.maxPriceValue;
  }

  public applyFilters(): void {
    this.productsService.getProductsWithFilters(this.filters);
    this.stateService.changeFilterMenuOpenedState();
  }

  public clearFilters(): void {
    this.getCategories();
    this.getBrands();
    this.resetSelect();
    this.resetCheckBoxes();
    this.resetRadioButtons();
    this.minPriceValue = 0;
    this.maxPriceValue = this.maxLimit;
    this.filters = {
      orderBy: OrderBy.LOWER_PRICE,
      minPrice: 0,
      brands: []
    };
    this.applyFilters();
  }

  public closeFiltersSideNav(): void {
    this.stateService.changeFilterMenuOpenedState();
  }

  private resetCheckBoxes(): void {
    const checkBoxes = document.querySelectorAll<HTMLInputElement>('input[type="checkbox"]');
    checkBoxes.forEach(checkBox => checkBox.checked = false);
  }

  private resetRadioButtons(): void {
    const radioButtons = document.querySelectorAll<HTMLInputElement>('input[type="radio"][name="category"]');
    radioButtons.forEach(radio => radio.checked = false);
  }

  private resetSelect(): void {
    const selectElement = document.getElementById('order-filter') as HTMLSelectElement;
    selectElement.options[0].selected = true;
  }

  private getCategories(): void {
    this.httpClient.get<any>(
      `${environment.apiBaseUrl}categories`, 
      { observe: 'response' })
      .subscribe(result => {
        if(result.ok) {
          this.categories = result.body!.categories;
        }
      }
    );
  }

  private getBrands(): void {
    this.httpClient.get<any>(
      `${environment.apiBaseUrl}brands`, 
      { observe: 'response' })
      .subscribe(result => {
        if(result.ok) {
          this.brands = result.body!.brands;
        }
      }
    );
  }

  private changeBrands(category: Category): void {
    this.httpClient.get<any>(
      `${environment.apiBaseUrl}brands/${category.id}`, 
      { observe: 'response' })
      .subscribe(result => {
        if(result.ok) {
          this.brands = result.body!.brands;
        }
      }
    );
  }
}
