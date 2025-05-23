import { HttpClient, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { GetActiveOrdersResponse } from '../responses/getActiveOrders.response';
import { Order } from '../models/order.model';
import { GetProductsFromOrderResponse } from '../responses/getProductsFromOrder.response';
import { Product } from '../models/product.model';
import { GetShippingOptionCostResponse } from '../responses/getShippingOptionCost.response';
import { ProcessOrderPaymentResponse } from '../responses/processOrderPayment.response';
import { CancelOrderResponse } from '../responses/cancelOrder.response';
import { GetCanceledOrdersResponse } from '../responses/getCanceledOrders.response';
import { GetUnassignedOrdersResponse } from '../responses/getUnassignedOrders.response';
import { GetAssignedOrdersResponse } from '../responses/getAssignedOrders.response';
import { GetInShippingOrdersResponse } from '../responses/getInShippingOrders.response';
import { GetOrdersInShopResponse } from '../responses/getOrdersInShop.response';
import { Pc } from '../models/pc.model';
import { GetPcProductsFromOrderResponse } from '../responses/getPcProductsFromOrder.response';
import { GetOrderByIdResponse } from '../responses/getOrderById.response';
import { GetShippingMethodResponse } from '../responses/getShippingMethod.response';
import { GetPaymentOptionResponse } from '../responses/getPaymentOption.response';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  private updatedOrderStatusSubject = new BehaviorSubject<number | null>(null)

  updatedOrderStatus$ = this.updatedOrderStatusSubject.asObservable()

  httpClient = inject(HttpClient)

  constructor() { }

  public async getOrderById(orderId: string): Promise<Order | null> {
    const response = await firstValueFrom(
      this.httpClient.get<GetOrderByIdResponse>(`${environment.apiBaseUrl}orders/${orderId}/order`, 
      { observe: 'response', withCredentials: true })
    )
    
    if(response.ok) return response.body!.order

    return null
  }

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

  public async getPcProductsFromOrder(orderId: number): Promise<Pc[]> {
    const response = await firstValueFrom(
      this.httpClient.get<GetPcProductsFromOrderResponse>(`${environment.apiBaseUrl}orders/${orderId}/pcs`, 
      { observe: 'response', withCredentials: true })
    )
    
    if(response.ok) {
      return response.body!.pcs;
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

  public async getAssignedOrders(employeeId: string | null) {
    if(!employeeId) return []

    const response = await firstValueFrom(
      this.httpClient.get<GetAssignedOrdersResponse>(
        `${environment.apiBaseUrl}orders/employee/${employeeId}/assigned`,
        { observe: 'response', withCredentials: true }
      )
    )

    if(response.ok) {
      console.log(response.body!.orders)
      return response.body!.orders
    } 

    return []
  }

  public async updateOrderStatusByEmployee(orderId: number, employeeId: string) {
    const response = await firstValueFrom(
      this.httpClient.put<any>(
        `${environment.apiBaseUrl}orders/${orderId}/employee/${employeeId}/changeStatus`, 
        null,
        { observe: 'response', withCredentials: true }
      )
    )

    return response
  }

  public async updateOrderAssembledStatusByEmployee(orderId: number) {
    const response = await firstValueFrom(
      this.httpClient.put<any>(
        `${environment.apiBaseUrl}orders/${orderId}/assembled/changeStatus`, 
        null,
        { observe: 'response', withCredentials: true }
      )
    )

    return response
  }

  public async getOrdersInShipping(employeeId: string) {
    const response = await firstValueFrom(
      this.httpClient.get<GetInShippingOrdersResponse>(
        `${environment.apiBaseUrl}orders/employee/${employeeId}/in-shipping`,
        { observe: 'response', withCredentials: true }
      )
    )

    if(response.ok) return response.body!.orders

    return []
  }

  public async getOrdersInShop() {
    const response = await firstValueFrom(
      this.httpClient.get<GetOrdersInShopResponse>(
        `${environment.apiBaseUrl}orders/in-shop`,
        { observe: 'response', withCredentials: true }
      )
    )

    if(response.ok) return response.body!.orders

    return []
  }

  public async getShippingMethodById(id: number) {
    const response = await firstValueFrom(
      this.httpClient.get<GetShippingMethodResponse>(
        `${environment.apiBaseUrl}orders/shippingMethod/${id}`,
        { observe: 'response', withCredentials: true }
      )
    )

    if(response.ok) return response.body!.shippingMethod

    return null
  }

  public async getPaymentOptionById(id: number) {
    const response = await firstValueFrom(
      this.httpClient.get<GetPaymentOptionResponse>(
        `${environment.apiBaseUrl}orders/paymentOption/${id}`,
        { observe: 'response', withCredentials: true }
      )
    )

    if(response.ok) return response.body!.paymentOption

    return null
  }

  public fireUpdatedOrderStatusEvent(orderId: number) {
    this.updatedOrderStatusSubject.next(orderId);
  }
}
