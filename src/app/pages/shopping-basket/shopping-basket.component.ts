import { Component, inject } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { MatIcon } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { ShoppingBasketItemComponent } from "../../components/shopping-basket-item/shopping-basket-item.component";

@Component({
  selector: 'app-shopping-basket',
  imports: [MatIcon, RouterModule, ShoppingBasketItemComponent ],
  templateUrl: './shopping-basket.component.html',
  styleUrl: './shopping-basket.component.css'
})
export class ShoppingBasketComponent {
  cartService = inject(CartService)
}
