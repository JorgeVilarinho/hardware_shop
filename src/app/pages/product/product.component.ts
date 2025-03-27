import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../models/product.model';
import { CurrencyPipe } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-product',
  imports: [ CurrencyPipe ],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent implements OnInit {
  activatedRoute = inject(ActivatedRoute)
  cartService = inject(CartService)
  product: Product | undefined

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(() => {
      this.product = window.history.state
    })
  }

  public getImage(imageFile: string | undefined): string {
    return environment.apiImageUrl + imageFile
  }

  public addProductToCart(): void {
    this.cartService.addItem(this.product);
  }
}
