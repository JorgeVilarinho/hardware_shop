import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ShippingMethod } from '../models/shippingMethod.model';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { ShippingOption } from '../models/shippingOption.model';

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
}
