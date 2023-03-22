import { AuthService } from './../auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { Injectable, isDevMode } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { ApilayerApiResponse } from 'src/app/modules/exchange-rate/exchange-rate-list/mock';
import { CreateExchangeRateApiRequest, GetExchangeRateApiResponse } from 'src/app/modules/exchange-rate/types';
import { exchangeRatesApiResponseMock } from './mock';
import { isMock } from '@shared/helpers';

export type GetExchangeRatesByDateAndCurrancyApiRequest = {
  dateFrom: string
  dateTo: string
  currancyTo: number
}

@Injectable({
  providedIn: 'root'
})
export class ExchangeRateService {

  constructor(
    private http: HttpClient,
    private AuthServ: AuthService

  ) { }

  load(): Observable<GetExchangeRateApiResponse[]> {
    return this.http.get<GetExchangeRateApiResponse[]>(`exchangeRate`)
    this.AuthServ.loadUser().subscribe()
    return of(exchangeRatesApiResponseMock).pipe(delay(500))
  }

  getExchangeRatesByDate(data: any): Observable<GetExchangeRateApiResponse[]> {
    return this.http.post<GetExchangeRateApiResponse[]>(`getExchangeRates`, data)
  }

  getExchangeRatesByDateAndCurrancy(data: GetExchangeRatesByDateAndCurrancyApiRequest): Observable<GetExchangeRateApiResponse[]> {
    if (isDevMode() && isMock()) {
      return of(exchangeRatesApiResponseMock)
    } else {
      return this.http.post<GetExchangeRateApiResponse[]>(`getExchangeRates`, data)
    }
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
