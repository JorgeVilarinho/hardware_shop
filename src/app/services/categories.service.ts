import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Category } from '../models/category.model';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { GetCategoriesResponse } from '../responses/getCategories.response';
import { GetCategoryResponse } from '../responses/getCategory.response';
import { CategoryValue } from '../models/categoryValue.model';

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

  public async getCategoryByName(categoryName: string): Promise<Category | undefined> {
    const response = await firstValueFrom(
      this.httpClient.get<GetCategoryResponse>(
        `${environment.apiBaseUrl}categories/${categoryName}`,
        { observe: 'response' }
      )
    )

    if (response.ok) return response.body!.category

    return undefined
  }

  public async getCategoryByValue(categoryValue: CategoryValue): Promise<Category | undefined> {
    const response = await firstValueFrom(
      this.httpClient.get<GetCategoryResponse>(
        `${environment.apiBaseUrl}categories/value/${categoryValue}`,
        { observe: 'response' }
      )
    )

    if (response.ok) return response.body!.category

    return undefined
  }
}
