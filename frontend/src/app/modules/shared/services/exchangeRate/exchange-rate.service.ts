import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApilayerApiResponse } from 'src/app/modules/exchange-rate/exchange-rate-list/mock';
import { CreateExchangeRateApiRequest, GetExchangeRateApiResponse } from 'src/app/modules/exchange-rate/types';


@Injectable({
  providedIn: 'root'
})
export class ExchangeRateService {

  constructor(
    private http: HttpClient

  ) { }

  load(): Observable<GetExchangeRateApiResponse[]> {
    return this.http.get<GetExchangeRateApiResponse[]>(`exchangeRate`)
  }
  getExchangeRatesByDate(data: any): Observable<GetExchangeRateApiResponse[]> {
    return this.http.post<GetExchangeRateApiResponse[]>(`getExchangeRates`, data)
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

  getCourses (data: any): Observable<ApilayerApiResponse> {
    // return of(apilayerResponse)
    return this.http.get<ApilayerApiResponse>(`api.apilayer.com/currency_data/timeframe?start_date=${data.dateFrom}&end_date=${data.dateTo}&currencies=USD,EUR,RSD,GBP,RUB&source=${data.source}`)
  }

  exchangeRateCreateBatch (data: CreateExchangeRateApiRequest[]): any {
    return this.http.post<GetExchangeRateApiResponse>(`exchangeRate/createBatch`, { data: data })
  }
}