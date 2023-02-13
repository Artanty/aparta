import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateExchangeRateApiRequest, GetExchangeRateApiResponse } from './types';

@Injectable({
  providedIn: 'root'
})
export class ExchangeRateService {

  constructor(
    private http: HttpClient,
  ) { }

  load(): Observable<GetExchangeRateApiResponse[]> {
    return this.http.get<GetExchangeRateApiResponse[]>(`exchangeRate`)
  }
  getExchangeRate (id: number): Observable<GetExchangeRateApiResponse> {
    return this.http.get<GetExchangeRateApiResponse>(`exchangeRate/${id}`)
  }

  create(data: CreateExchangeRateApiRequest): Observable<GetExchangeRateApiResponse> {
    return this.http.post<GetExchangeRateApiResponse>(`exchangeRate`, data)
  }

  update(data: any) {
    return this.http.put(`exchangeRate/${data.id}`, data)
  }

  delete(id: number) {
    return this.http.delete(`exchangeRate/${id}`)
  }

  getCourses () {
    this.http.get<any>(`currate.ru/api/?get=currency_list&key=377db9a280ae60f8d43c79225c38a1c3`).subscribe({
      next: (res: any) => {
        console.log(res)
      }
    })
  }


}
