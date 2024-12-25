import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../models/product.model';
import { Cart } from '../models/cart.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  // TODO: Temporary localStorage, remove it when is necesary
  localStorageService = inject(LocalStorageService);
  productsInCart = new BehaviorSubject<Cart>({ items: this.localStorageService.getItem('items') ? JSON.parse(this.localStorageService.getItem('items')!) : [] });
  message: string | undefined;
  snackBar: MatSnackBar = inject(MatSnackBar);

  constructor() { }

  public addItem(item: Product | undefined): void {
    if(!item) {
      this.snackBar.open("ERROR: Problema al insertar el producto", 'Ok', { duration: 3000 });
      return;
    }

    const items = [...this.productsInCart.value.items];

    const itemInCart = items.find(_item => _item.id == item.id);

    if(itemInCart) {
      if(itemInCart.units >= item.units) {
        this.snackBar.open('No se pueden añadir más unidades del producto ' 
          + 'debido a que no tenemos más en la tienda', 'Ok', { duration: 3000 });
        return
      }

      itemInCart.units += 1;
      this.message = "Se ha incrementado el producto a una unidad más";
    } else {
      const copyOfItem = { ...item };
      copyOfItem.units = 1;

      items.push(copyOfItem);
      this.message = "Se ha añadido el producto correctamente";
    }

    this.localStorageService.setItem('items', JSON.stringify(items)) // TODO: This is temporary, remove it.
    this.productsInCart.next({ items });
    this.snackBar.open(this.message, 'Ok', { duration: 3000 });
  }

  public removeItem(id: number): void {
    const items = [...this.productsInCart.value.items];

    const index = items.findIndex(x => x.id === id);

    if(index === -1) {
      this.snackBar.open('No se ha podido eliminar el producto correctamente', 'Ok', { duration: 3000 });
      return
    }

    items.splice(index, 1);

    this.productsInCart.next({ items });
    this.snackBar.open('Se ha eliminado el producto correctamente', 'Ok', { duration: 3000 });
  }

  public removeAllItems(): void {
    this.productsInCart.next({ items: [] });
    this.snackBar.open('Se han eliminado todos los productos del carrito', 'Ok', { duration: 3000 })
  }

  public getCountItems(): number {
    return this.productsInCart.value.items.length
  }

  public getTotal(): number {
    return this.productsInCart.value.items
    .map(_item => _item.discount ? _item.units * _item.price * (100 - _item.discount) / 100 : _item.units * _item.price)
    .reduce((previous, current) => previous + current, 0)
  }
}
