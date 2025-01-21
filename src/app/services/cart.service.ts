import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../models/product.model';
import { Cart } from '../models/cart.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LocalStorageService } from './local-storage.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { AuthenticationService } from './authentication.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  localStorageService = inject(LocalStorageService);
  authenticationService = inject(AuthenticationService);
  httpClient = inject(HttpClient);
  snackBar: MatSnackBar = inject(MatSnackBar);
  
  message: string | undefined;
  productsInCart = new BehaviorSubject<Cart>({ items: this.localStorageService.getItem('items') ? JSON.parse(this.localStorageService.getItem('items')!) : [] });

  constructor() {
    this.listenToLogOut();
  }

  public getItems(): Product[] {
    return this.productsInCart.value.items;
  }

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

      this.message = 'Se ha incrementado el producto en una unidad más';
      itemInCart.units += 1;
      this.upsertItemToShoppingBasketDatabase(itemInCart.id, itemInCart.units);
    } else {
      const copyOfItem = { ...item };
      copyOfItem.units = 1;

      this.message = 'Se ha añadido el producto correctamente'
      items.push(copyOfItem);
      this.upsertItemToShoppingBasketDatabase(copyOfItem.id, copyOfItem.units);
    }

    this.localStorageService.setItem('items', JSON.stringify(items))
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
    
    if(this.authenticationService.isLoggedIn()) {
      this.deleteItemToShoppingBasketDatabase(id);
    }
    this.localStorageService.setItem('items', JSON.stringify(items))
    this.productsInCart.next({ items });
    this.snackBar.open('Se ha eliminado el producto correctamente', 'Ok', { duration: 3000 });
  }

  public removeAllItems(): void {
    if(this.authenticationService.isLoggedIn()) {
      this.removeAllItemsToShoppingBasketDatabase();
    }
    this.localStorageService.removeItem('items');
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

  public getTaxImport(): number {
    return this.getTotal() * 21 / 100
  }

  public getTotalWithTax(): number {
    return this.getTotal() + this.getTaxImport()
  }

  public upsertItemToShoppingBasketDatabase(product_id: number, units: number) {
    if(!this.authenticationService.isLoggedIn()) {
      return
    }

    this.httpClient.post(`${environment.apiBaseUrl}shopping-basket/item`, 
      {product_id, units }, { observe: 'response', withCredentials: true})
      .subscribe(result => {
        if(!result.ok) {
          this.snackBar.open('No se ha podido realizar la acción en el carrito', 'Ok', { duration: 3000 });
        }
      }
    );
  }

  private deleteItemToShoppingBasketDatabase(product_id: number) {
    if(!this.authenticationService.isLoggedIn()) {
      return
    }

    this.httpClient.delete(`${environment.apiBaseUrl}shopping-basket/item`, 
      { observe: 'response', withCredentials: true, body: { product_id } })
      .subscribe(result => {
        if(!result.ok) {
          this.snackBar.open('No se ha podido eliminar el producto del carrito', 'Ok', { duration: 3000 });
        }
      }
    );
  }

  private removeAllItemsToShoppingBasketDatabase() {
    if(!this.authenticationService.isLoggedIn()) {
      return
    }

    this.httpClient.delete(`${environment.apiBaseUrl}shopping-basket/items`,
      { observe: 'response', withCredentials: true })
      .subscribe(result => {
        if(!result.ok) {
          this.snackBar.open('No se ha podido eliminar todos los productos del carrito', 'Ok', { duration: 3000 });
        }
      })
  }

  private listenToLogOut(): void {
    this.authenticationService.logOutEvent
    .pipe(takeUntilDestroyed())
    .subscribe(() => this.removeAllItems())
  }
}
