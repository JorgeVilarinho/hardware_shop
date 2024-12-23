import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../models/product.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  httpClient = inject(HttpClient)
  snackBar = inject(MatSnackBar)

  private getAllProductsSubject = new BehaviorSubject<Product[]>([]);

  getAllProducts$ = this.getAllProductsSubject.asObservable(); 

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
}
