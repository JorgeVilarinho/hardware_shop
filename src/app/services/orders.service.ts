import { HttpClient, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { GetActiveOrdersResponse } from '../responses/getActiveOrders.response';
import { Order } from '../models/order.model';
import { GetProductsFromOrderResponse } from '../responses/getProductsFromOrder.response';
import { Product } from '../models/product.model';
import { GetShippingOptionCostResponse } from '../responses/getShippingOptionCost.response';
import { ProcessOrderPaymentResponse } from '../responses/processOrderPayment.response';
import { CancelOrderResponse } from '../responses/cancelOrder.response';
import { GetCanceledOrdersResponse } from '../responses/getCanceledOrders.response';
import { GetUnassignedOrdersResponse } from '../responses/getUnassignedOrders.response';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  httpClient = inject(HttpClient)

  constructor() { }

  public async getClientActiveOrders(): Promise<Order[]> {
    const response = await firstValueFrom(
      this.httpClient.get<GetActiveOrdersResponse>(`${environment.apiBaseUrl}orders/active`, 
      { observe: 'response', withCredentials: true })
    )
    
    if(response.ok) {
      return response.body!.orders;
    }

    return []
  }

  public async getClientCanceledOrders(): Promise<Order[]> {
    const response = await firstValueFrom(
      this.httpClient.get<GetCanceledOrdersResponse>(`${environment.apiBaseUrl}orders/canceled`, 
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
      return response.body!.products;
    }
    
    return []
  }

  public async getShippingOptionCost(shippingOptionId: number): Promise<number> {
    const response = await firstValueFrom(
      this.httpClient.get<GetShippingOptionCostResponse>(`${environment.apiBaseUrl}orders/${shippingOptionId}/cost`, 
      { observe: 'response', withCredentials: true })
    )
    
    if(response.ok) {
      return response.body!.cost;
    }
    
    return 0
  }

  public async processOrderPayment(orderId: number): Promise<Order | undefined> {
    const response = await firstValueFrom(
      this.httpClient.post<ProcessOrderPaymentResponse>(
        `${environment.apiBaseUrl}orders/${orderId}/payment`, 
        {}, 
        { observe: 'response', withCredentials: true }
      )
    )

    if(response.ok) {
      return response.body?.order!
    }

    return undefined
  }

  public async cancelOrder(orderId: number): Promise<HttpResponse<CancelOrderResponse>> {
    const response = await firstValueFrom(
      this.httpClient.put<CancelOrderResponse>(
        `${environment.apiBaseUrl}orders/${orderId}/cancel`, 
        {},
        { observe: 'response', withCredentials: true }
      )
    )

    return response
  }

  public async getUnassignedOrders() {
    const response = await firstValueFrom(
      this.httpClient.get<GetUnassignedOrdersResponse>(
        `${environment.apiBaseUrl}orders/unassigned`,
        { observe: 'response', withCredentials: true }
      )
    )

    if(response.ok) return response.body!.orders

    return []
  }
}
