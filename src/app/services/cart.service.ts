import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { Product } from '../models/product.model';
import { Cart } from '../models/cart.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LocalStorageService } from './local-storage.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AuthenticationService } from './authentication.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Pc } from '../models/pc.model';
import { PcConfiguratorService } from './pc-configurator.service';
import { InsertPcProductToShoppingBasketResponse } from '../responses/insertPcProductToShoppingBasket.response';
import { PcData } from '../models/pcData.model';
import { InsertPcToDatabaseResponse } from '../responses/insertPcToDatabase.response';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  localStorageService = inject(LocalStorageService);
  authenticationService = inject(AuthenticationService);
  pcConfiguratorService = inject(PcConfiguratorService);
  httpClient = inject(HttpClient);
  snackBar = inject(MatSnackBar);
  
  message: string | undefined;
  productsInCart = new BehaviorSubject<Cart>({ 
    items: this.localStorageService.getItem('items') ? JSON.parse(this.localStorageService.getItem('items')!) : [],
    pcs: this.localStorageService.getItem('pcs') ? JSON.parse(this.localStorageService.getItem('pcs')!) : []
  });

  constructor() {
    this.listenToLogOut();
  }

  public getItems(): Product[] {
    return this.productsInCart.value.items;
  }

  public getPcs(): Pc[] {
    return this.productsInCart.value.pcs;
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
    this.productsInCart.next({ items, pcs: this.productsInCart.value.pcs });
    this.snackBar.open(this.message, 'Ok', { duration: 3000 });
  }

  public async addPcProduct(pcData: PcData): Promise<void> {
    if(!pcData) {
      this.snackBar.open("ERROR: Problema al insertar el producto", 'Ok', { duration: 3000 })
      return
    }

    let pc = await this.insertPcToDatabase(pcData)

    if(!pc) {
      this.snackBar.open('No se ha podido añadir el PC al carrito', 'Ok', { duration: 3000 });
      return
    }

    if(this.authenticationService.isLoggedIn()) await this.insertPcProductToShoppingBasketDatabase(pc)

    let pcs = this.productsInCart.value.pcs
    pcs.push(pc)

    this.localStorageService.setItem('pcs', JSON.stringify(pcs))
    this.productsInCart.next({ items: this.productsInCart.value.items, pcs })
    this.snackBar.open('Se ha añadido el producto correctamente', 'Ok', { duration: 3000 })
    this.pcConfiguratorService.clearProduct()
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
    this.productsInCart.next({ items, pcs: this.productsInCart.value.pcs });
    this.snackBar.open('Se ha eliminado el producto correctamente', 'Ok', { duration: 3000 });
  }

  public removePcProduct(id: number): void {
    const pcs = [...this.productsInCart.value.pcs];

    const index = pcs.findIndex(x => x.id === id);

    if(index === -1) {
      this.snackBar.open('No se ha podido eliminar el producto correctamente', 'Ok', { duration: 3000 });
      return
    }

    pcs.splice(index, 1);
    
    if(this.authenticationService.isLoggedIn()) this.deletePcToShoppingBasketDatabase(id);

    this.localStorageService.setItem('pcs', JSON.stringify(pcs))
    this.productsInCart.next({ items: this.productsInCart.value.items, pcs });
    this.snackBar.open('Se ha eliminado el producto correctamente', 'Ok', { duration: 3000 });
  }

  public removeAllItems(): void {
    if(this.authenticationService.isLoggedIn()) {
      this.removeAllItemsToShoppingBasketDatabase()
      this.removeAllPcProductsToShoppingBasketDatabase()
    }
    
    this.localStorageService.removeItem('items')
    this.localStorageService.removeItem('pcs')
    this.productsInCart.next({ items: [], pcs: [] })
    this.snackBar.open('Se han eliminado todos los productos del carrito', 'Ok', { duration: 3000 })
  }

  public getCountItems(): number {
    return this.productsInCart.value.items.length + this.productsInCart.value.pcs.length 
  }

  public getTotal(): number {
    let total = this.productsInCart.value.items
    .map(_item => _item.discount ? _item.units * _item.price * (100 - _item.discount) / 100 : _item.units * _item.price)
    .reduce((previous, current) => previous + current, 0)

    for(let i = 0; i < this.productsInCart.value.pcs.length; i++) {
      let pc = this.productsInCart.value.pcs[i]

      for(let j = 0; j < pc.components.length; j++) {
        let component = pc.components[j]

        if(component.discount > 0) {
          total += (component!.price * (100 - component!.discount)) / 100
        } else {
          total += component.price
        }
      }
    }

    return total
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

  public async insertPcToDatabase(pcData: PcData): Promise<Pc | undefined> {
    const response = await firstValueFrom(
      this.httpClient.post<InsertPcToDatabaseResponse>(
        `${environment.apiBaseUrl}pc`, 
        { pcData }, 
        { observe: 'response' }
      )
    )

    if(response.ok) return response.body!.pc

    return undefined
  }

  public async insertPcProductToShoppingBasketDatabase(pcProduct: Pc): Promise<void> {
    const response = await firstValueFrom(
      this.httpClient.post<InsertPcProductToShoppingBasketResponse>(
        `${environment.apiBaseUrl}shopping-basket/pc-product`, 
        { pcProduct }, 
        { observe: 'response', withCredentials: true }
      )
    )

    if(!response.ok) {
      this.snackBar.open('No se ha podido realizar la acción en el carrito', 'Ok', { duration: 3000 });
    }
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

  private async deletePcToShoppingBasketDatabase(pcId: number) {
    if(!this.authenticationService.isLoggedIn()) {
      return
    }

    const response = await firstValueFrom(
      this.httpClient.delete(`${environment.apiBaseUrl}shopping-basket/pc`, 
      { observe: 'response', withCredentials: true, body: { pcId } })
    )

    if(!response.ok) this.snackBar.open('No se ha podido eliminar el producto del carrito', 'Ok', { duration: 3000 });
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
      }
    )
  }

  private removeAllPcProductsToShoppingBasketDatabase() {
    if(!this.authenticationService.isLoggedIn()) {
      return
    }

    this.httpClient.delete(`${environment.apiBaseUrl}shopping-basket/pc-products`,
      { observe: 'response', withCredentials: true })
      .subscribe(result => {
        if(!result.ok) {
          this.snackBar.open('No se ha podido eliminar todos los productos del carrito', 'Ok', { duration: 3000 });
        }
      }
    )
  }

  private listenToLogOut(): void {
    this.authenticationService.logOutEvent
    .pipe(takeUntilDestroyed())
    .subscribe(() => this.removeAllItems())
  }
}
