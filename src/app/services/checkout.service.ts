import { CreateOrderResponse } from './../responses/createOrder.response';
import { PaymentOption } from './../models/paymentOption.model';
import { ShippingOption } from './../models/shippingOption.model';
import { ShippingMethod } from './../models/shippingMethod.model';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { Product } from '../models/product.model';
import { Order } from '../models/order.model';
import { Address } from '../models/address.model';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  httpClient = inject(HttpClient)

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

  public async createOrder(products: Product[], shippingMethod: ShippingMethod, 
    shippingOption: ShippingOption, paymentOption: PaymentOption, 
    total: number, address: Address): Promise<Order | undefined> {
    const response = await firstValueFrom(
      this.httpClient.post<CreateOrderResponse>(
        `${environment.apiBaseUrl}checkout`, 
        { 
          products, 
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
      return response.body?.order
    }

    return undefined
  }
}
