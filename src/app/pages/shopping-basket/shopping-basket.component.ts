import { Component, inject } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { MatIcon } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { ShoppingBasketItemComponent } from "../../components/shopping-basket-item/shopping-basket-item.component";
import { CurrencyPipe } from '@angular/common';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-shopping-basket',
  imports: [ MatIcon, RouterModule, ShoppingBasketItemComponent, CurrencyPipe ],
  templateUrl: './shopping-basket.component.html',
  styleUrl: './shopping-basket.component.css'
})
export class ShoppingBasketComponent {
  cartService = inject(CartService)
  httpClient = inject(HttpClient)

  public removeAllItems(): void {
    this.cartService.removeAllItems();
  }

  public getTotal(): number {
    return this.cartService.getTotal();
  }

  public getTaxImport(): number {
    return this.getTotal() * 21 / 100;
  }

  public getTotalWithTax(): number {
    return this.getTotal() + this.getTaxImport();
  }
}
