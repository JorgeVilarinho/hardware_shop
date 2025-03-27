import { Component, inject, Input, OnInit } from '@angular/core';
import { Product } from '../../models/product.model';
import { CurrencyPipe } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { CartService } from '../../services/cart.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LocalStorageService } from '../../services/local-storage.service';

@Component({
  selector: 'app-shopping-basket-item',
  imports: [ CurrencyPipe, MatIcon ],
  templateUrl: './shopping-basket-item.component.html',
  styleUrl: './shopping-basket-item.component.css'
})
export class ShoppingBasketItemComponent implements OnInit {
  @Input() cartItem: Product | undefined;
  cartService = inject(CartService)
  localStorage = inject(LocalStorageService)
  httpClient = inject(HttpClient)
  snackBar = inject(MatSnackBar)
  stock: number = 0

  ngOnInit(): void {
    this.httpClient.get<any>(`${environment.apiBaseUrl}products/${this.cartItem?.id}/stock`, 
      { observe: 'response' })
      .subscribe(result => {
        if(result.ok) {
          this.stock = result.body.stock
        } else {
          this.snackBar.open('ERROR: No se ha podido sacar el stock del producto', 'Ok', { duration: 3000 });
        }
      }
    );
  }

  public getImage(imageFile: string | undefined): string {
    return environment.apiImageUrl + imageFile
  }

  public removeItem(): void {
    this.cartService.removeItem(this.cartItem!.id);
  }

  public addUnits(): void {
    if(this.cartItem!.units >= this.stock) {
      this.snackBar.open('No hay más stock', 'Ok', { duration: 3000 });
      return
    }

    this.cartItem!.units += 1;
    this.cartService.upsertItemToShoppingBasketDatabase(this.cartItem!.id, this.cartItem!.units);
    this.localStorage.setItem('items', JSON.stringify(this.cartService.productsInCart.value.items));
  }

  public substractUnits(): void {
    if(this.cartItem!.units == 1) {
      return
    }

    this.cartItem!.units -= 1;
    this.cartService.upsertItemToShoppingBasketDatabase(this.cartItem!.id, this.cartItem!.units);
    this.localStorage.setItem('items', JSON.stringify(this.cartService.productsInCart.value.items));
  }

  public changeUnits(event: Event): void {
    const input = event.target as HTMLInputElement;
    
    if(!input.value) {
      input.value = this.cartItem?.units!.toString()!;
      return
    }

    if(+input.value > this.stock) {
      input.value = this.cartItem?.units!.toString()!;
      this.snackBar.open('No hay más stock', 'Ok', { duration: 3000 });
      return
    }

    this.cartItem!.units = +input.value;
    this.cartService.upsertItemToShoppingBasketDatabase(this.cartItem!.id, this.cartItem!.units);
    this.localStorage.setItem('items', JSON.stringify(this.cartService.productsInCart.value.items));
  }
}
