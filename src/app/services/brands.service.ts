import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Brand } from '../models/brand.model';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { GetBrandsResponse } from '../responses/getBrands.response';
import { GetBrandsByCategoryResponse } from '../responses/getBrandsByCategory.response';
import { GetBrandByValueResponse } from '../responses/getBrandsByValue.response';

@Injectable({
  providedIn: 'root',
})
export class BrandsService {
  httpClient = inject(HttpClient);

  constructor() {}

  public async getBrands(): Promise<Brand[]> {
    const response = await firstValueFrom(
      this.httpClient.get<GetBrandsResponse>(`${environment.apiBaseUrl}brands`, {
        observe: 'response',
      })
    );

    if (response.ok) return response.body!.brands;

    return [];
  }

  public async getBrandByValue(brandValue: string): Promise<Brand | undefined> {
    const response = await firstValueFrom(
      this.httpClient.get<GetBrandByValueResponse>(
        `${environment.apiBaseUrl}brands/${brandValue}`, {
        observe: 'response',
      })
    );

    if (response.ok) return response.body!.brand;

    return undefined;
  }

  public async getBrandsByCategory(categoryId: number): Promise<Brand[]> {
    const response = await firstValueFrom(
      this.httpClient.get<GetBrandsByCategoryResponse>(
        `${environment.apiBaseUrl}brands/category/${categoryId}`, {
        observe: 'response',
      })
    );
    
    if (response.ok) return response.body!.brands;

    return [];
  }
}
