import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GptApiService {
  apiUrl = 'YOUR_GPT_API_ENDPOINT'; // Replace with your actual API endpoint

  constructor(private httpClient: HttpClient) { }

  sendDataToGptApi(data: string): Observable<any> {
    const payload = { text: data }; // Modify as needed
    return this.httpClient.post<any>(this.apiUrl, payload);
  }
}
