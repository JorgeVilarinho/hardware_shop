import { CreateOrderResponse } from './../responses/createOrder.response';
import { PaymentOption } from './../models/paymentOption.model';
import { ShippingOption } from './../models/shippingOption.model';
import { ShippingMethod } from './../models/shippingMethod.model';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { Product } from '../models/product.model';
import { OrderRepository } from '../models/orderRepository.model';
import { Address } from '../models/address.model';
import { Pc } from '../models/pc.model';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  httpClient = inject(HttpClient)
  
  createOrderSubject = new BehaviorSubject<OrderRepository | null>(null)

  constructor() { }

  public async getShippingMethods(): Promise<ShippingMethod[]> {
    const response = await firstValueFrom(
      this.httpClient.get<any>(
        `${environment.apiBaseUrl}checkout/shipping-methods`, 
        { observe: 'response', withCredentials: true }
      )
    )

    if(response.ok) {
      return response.body.shippingMethods
    }

    return []
  }

  public async getShippingOptions(): Promise<ShippingOption[]> {
    const response = await firstValueFrom(
      this.httpClient.get<any>(
        `${environment.apiBaseUrl}checkout/shipping-options`, 
        { observe: 'response', withCredentials: true }
      )
    )

    if(response.ok) {
      return response.body.shippingOptions
    }

    return []
  }

  public async getPaymentOptions(): Promise<PaymentOption[]> {
    const response = await firstValueFrom(
      this.httpClient.get<any>(
        `${environment.apiBaseUrl}checkout/payment-options`, 
        { observe: 'response', withCredentials: true }
      )
    )

    if(response.ok) {
      return response.body.paymentOptions
    }

    return []
  }

  public async createOrder(products: Product[], pcs: Pc[], shippingMethod: ShippingMethod, 
    shippingOption: ShippingOption, paymentOption: PaymentOption, 
    total: number, address: Address): Promise<OrderRepository | null> {
    const response = await firstValueFrom(
      this.httpClient.post<CreateOrderResponse>(
        `${environment.apiBaseUrl}checkout`, 
        { 
          products, 
          pcs,
          shippingMethod: shippingMethod, 
          shippingOption: shippingOption, 
          paymentOption: paymentOption,
          total,
          address
        },
        { observe: 'response', withCredentials: true }
      )
    )

    if(response.ok) {
      return response.body?.order ?? null
    }

    return null
  }
}
