import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { GetActiveOrdersResponse } from '../responses/getActiveOrders.response';
import { ActiveOrder } from '../models/activeOrder.model';
import { GetProductsFromOrderResponse } from '../responses/getProductsFromOrder.response';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  httpClient = inject(HttpClient)

  constructor() { }

  public async getActiveOrders(): Promise<ActiveOrder[]> {
    const response = await firstValueFrom(
      this.httpClient.get<GetActiveOrdersResponse>(`${environment.apiBaseUrl}orders/activeOrders`, 
      { observe: 'response', withCredentials: true })
    )
    
    if(response.ok) {
      return response.body!.orders;
    }

    return []
  }

  public async getProductsFromOrder(orderId: number): Promise<Product[]> {
    const response = await firstValueFrom(
      this.httpClient.get<GetProductsFromOrderResponse>(`${environment.apiBaseUrl}orders/${orderId}/products`, 
      { observe: 'response', withCredentials: true })
    )
    
    if(response.ok) {
      console.log(response.body?.products)
      return response.body!.products;
    }
    
    return []
  }
}
