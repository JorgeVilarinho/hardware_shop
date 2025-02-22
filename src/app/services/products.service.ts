import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { Product } from '../models/product.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Filters } from '../models/filters.model';
import { GetProductByIdResponse } from '../responses/getProductById.response';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  DEFAULT_MAX_PRICE = 5000;

  httpClient = inject(HttpClient)
  snackBar = inject(MatSnackBar)

  private getAllProductsSubject = new BehaviorSubject<Product[]>([]);
  private getProductsWithFiltersSubject = new BehaviorSubject<Product[]>([]);

  getAllProducts$ = this.getAllProductsSubject.asObservable();
  getProductsWithFilters$ = this.getProductsWithFiltersSubject.asObservable();

  constructor() { }

  public getAllProducts(): void {
    this.httpClient.get<any>(`${environment.apiBaseUrl}products`, 
      { observe: 'response' }).subscribe(result => {
        if(result.ok) {
          this.getAllProductsSubject.next(result.body.products);
          return
        }
        
        this.snackBar.open(result.body.message);
      }
    )
  }

  public async getAllProductsAsync() {
    const response = await firstValueFrom(
      this.httpClient.get<any>(`${environment.apiBaseUrl}products`, 
      { observe: 'response' })
    )

    if(response.ok) return response.body.products

    return []
  }

  public async getMaxPrice(): Promise<number> {
    let response = await firstValueFrom(this.httpClient.get<any>(`${environment.apiBaseUrl}products/maxPrice`, 
      { observe: 'response' }));

    if(response.ok) {
      return response.body.maxPrice;
    }

    return this.DEFAULT_MAX_PRICE;
  }

  public getProductsWithFilters(filters: Filters): void {
    let url = `${environment.apiBaseUrl}products?`
    let queryParams = []

    if(filters.orderBy !== undefined) {
      queryParams.push('orderBy=' + filters.orderBy);
    }

    if(filters.minPrice !== undefined) {
      queryParams.push('minPrice=' + filters.minPrice)
    }

    if(filters.maxPrice !== undefined) {
      queryParams.push('maxPrice=' + filters.maxPrice);
    }

    if(filters.category) {
      queryParams.push('category=' + filters.category.id);
    }

    if(filters.brands && filters.brands.length > 0) {
      queryParams.push('brands=' + filters.brands.map(x => x.id).join(','))
    }

    url += queryParams.join('&');

    this.httpClient.get<any>(url, { observe: 'response' })
    .subscribe(result => {
        if(result.ok) {
          this.getProductsWithFiltersSubject.next(result.body.products);
          return
        }
        
        this.snackBar.open(result.body.message);
      }
    )
  }

  public async getProductById(productId: string): Promise<Product | undefined> {
    const response = await firstValueFrom(
      this.httpClient.get<GetProductByIdResponse>(
        `${environment.apiBaseUrl}products/${productId}`, 
        { observe: 'response' }
      )
    )

    if(response.ok) return response.body!.product

    return undefined
  }
}
