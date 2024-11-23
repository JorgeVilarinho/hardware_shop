import { Component, inject, Input } from '@angular/core';
import { MatCard } from '@angular/material/card';
import { Product } from '../../models/product.model';
import { MatButtonModule } from '@angular/material/button';
import { CartService } from '../../services/cart.service';
import { CurrencyPipe, NgClass } from '@angular/common';

@Component({
  selector: 'app-product-box',
  imports: [ MatCard, MatButtonModule, CurrencyPipe, NgClass ],
  templateUrl: './product-box.component.html',
  styleUrl: './product-box.component.css'
})
export class ProductBoxComponent {
  @Input() product: Product | undefined;
  cartService = inject(CartService);

  onAddProductToCart(): void {
    this.cartService.addProduct(this.product)
  }
}
