import { HttpClient, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ImagesService {
  httpClient = inject(HttpClient);

  constructor() {}

  public async uploadImage(image: Blob): Promise<HttpResponse<any>> {
    const formData = new FormData()
    formData.append('uploadImage', image)

    const response = await firstValueFrom(
      this.httpClient.post<any>(
        `${environment.apiBaseUrl}images/image`,
        formData,
        { observe: 'response', withCredentials: true }
      )
    );

    return response;
  }
}
