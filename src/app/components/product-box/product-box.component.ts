import { Component, inject, Input } from '@angular/core';
import { Product } from '../../models/product.model';
import { MatButtonModule } from '@angular/material/button';
import { CartService } from '../../services/cart.service';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-product-box',
  imports: [ MatButtonModule, CurrencyPipe, RouterLink ],
  templateUrl: './product-box.component.html',
  styleUrl: './product-box.component.css'
})
export class ProductBoxComponent {
  @Input() product: Product | undefined;
  cartService = inject(CartService);

  onAddProductToCart(): void {
    this.cartService.addItem(this.product)
  }
}
