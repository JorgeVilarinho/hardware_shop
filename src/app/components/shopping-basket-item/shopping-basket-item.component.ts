import { Component, Input } from '@angular/core';
import { Product } from '../../models/product.model';
import { CurrencyPipe } from '@angular/common';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-shopping-basket-item',
  imports: [ CurrencyPipe, MatIcon ],
  templateUrl: './shopping-basket-item.component.html',
  styleUrl: './shopping-basket-item.component.css'
})
export class ShoppingBasketItemComponent {
  @Input() cartItem: Product | undefined;


}
