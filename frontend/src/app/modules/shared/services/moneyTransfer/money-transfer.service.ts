import { HttpClient } from '@angular/common/http';
import { Injectable, isDevMode } from '@angular/core';
import { isMock } from '@shared/helpers';
import { Observable, of } from 'rxjs';
import { moneyTransferGetApiResponseMock } from './mock';
import { CreateMoneyTransferApiRequest, CreateMoneyTransferApiResponse, LoadMoneyTransferApiResponse } from './types';

@Injectable({
  providedIn: 'root'
})
export class MoneyTransferService {

  constructor(
    private http: HttpClient

  ) { }

  load(): Observable<LoadMoneyTransferApiResponse[]> {
    if (isDevMode() && isMock()) {
      return of(moneyTransferGetApiResponseMock)
    } else {
      return this.http.get<LoadMoneyTransferApiResponse[]>(`moneyTransfer`)
    }
  }

  getMoneyTransfer (id: number) {
    return this.http.get(`moneyTransfer/${id}`)
  }

  create(data: CreateMoneyTransferApiRequest): Observable<CreateMoneyTransferApiResponse> {
    return this.http.post<CreateMoneyTransferApiResponse>(`moneyTransfer`, data)
  }

  update(data: any) {
    return this.http.put(`moneyTransfer/${data.id}`, data)
  }

  delete(id: number) {
    return this.http.delete(`moneyTransfer/${id}`)
  }
}
