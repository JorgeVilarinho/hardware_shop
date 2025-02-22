import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Category } from '../models/category.model';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { GetCategoriesResponse } from '../responses/getCategories.response';
import { GetCategoryByValueResponse } from '../responses/getCategoryByValue.response';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  httpClient = inject(HttpClient);

  constructor() {}

  public async getCategories(): Promise<Category[]> {
    const response = await firstValueFrom(
      this.httpClient.get<GetCategoriesResponse>(
        `${environment.apiBaseUrl}categories`,
        { observe: 'response' }
      )
    )

    if (response.ok) return response.body!.categories

    return []
  }

  public async getCategoryByValue(categoryValue: string): Promise<Category | undefined> {
    const response = await firstValueFrom(
      this.httpClient.get<GetCategoryByValueResponse>(
        `${environment.apiBaseUrl}categories/${categoryValue}`,
        { observe: 'response' }
      )
    )

    if (response.ok) return response.body!.category

    return undefined
  }
}
