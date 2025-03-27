import { Component, inject, OnInit } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { Product } from '../../models/product.model';
import { ProductsService } from '../../services/products.service';
import { CurrencyPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-products-dashboard',
  imports: [ MatIcon, RouterLink, CurrencyPipe ],
  templateUrl: './products-dashboard.component.html',
  styleUrl: './products-dashboard.component.css'
})
export class ProductsDashboardComponent implements OnInit {
  products: Product[] = []

  productsService = inject(ProductsService)
  router = inject(Router)

  async ngOnInit(): Promise<void> {
    this.products = await this.productsService.getAllProductsAsync()
  }

  public getImage(imageFile: string): string {
    return environment.apiImageUrl + imageFile
  }

  public goToModifyProduct(productId: number): void {
    this.router.navigate([`/dashboard/products/${productId}`])
  }
}
