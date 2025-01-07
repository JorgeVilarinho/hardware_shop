import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion'
import { MatSliderModule } from '@angular/material/slider';
import { Category } from '../../models/category.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Brand } from '../../models/brand.model';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-filters-sidenav',
  imports: [ MatIconModule, MatButtonModule, MatExpansionModule, MatSliderModule, CurrencyPipe ],
  templateUrl: './filters-sidenav.component.html',
  styleUrl: './filters-sidenav.component.css'
})
export class FiltersSidenavComponent {
  httpClient = inject(HttpClient);
  
  minPriceValue = 0;
  maxPriceValue = 1500;
  categories: Category[] = [];
  brands: Brand[] = [];

  constructor() {
    this.getCategories();
  }

  public selectCategory(id: number): void {
    this.changeBrands(this.categories.find(x => x.id == id)!);
  }

  private getCategories(): void {
    this.httpClient.get<any>(
      `${environment.apiBaseUrl}categories`, 
      { observe: 'response' })
      .pipe(takeUntilDestroyed())
      .subscribe(result => {
        if(result.ok) {
          this.categories = result.body!.categories;
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
