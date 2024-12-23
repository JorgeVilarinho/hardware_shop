import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../models/product.model';
import { Cart } from '../models/cart.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  productsInCart = new BehaviorSubject<Cart>({ items: [] });
  message: string | undefined;
  snackBar: MatSnackBar = inject(MatSnackBar);

  constructor() { }

  addProduct(item: Product | undefined): void {
    if(!item) {
      this.snackBar.open("ERROR: Problema al insertar el producto", 'Ok', { duration: 3000 });
      return;
    }

    const items = [...this.productsInCart.value.items];

    const itemInCart = items.find(_item => _item.id == item.id);

    if(itemInCart) {
      itemInCart.units += 1;
      this.message = "Se ha incrementado el producto a una unidad más";
    } else {
      items.push(item);
      this.message = "Se ha añadido el producto correctamente";
    }

    this.productsInCart.next({ items });
    this.snackBar.open(this.message, 'Ok', { duration: 3000 });
  }

  getCountProducts(): number {
    return this.productsInCart.value.items.length
  }

  getTotal(): number {
    return this.productsInCart.value.items
    .map(_item => _item.discount ? _item.units * _item.price * (100 - _item.discount) / 100 : _item.units * _item.price)
    .reduce((previous, current) => previous + current, 0)
  }
}
