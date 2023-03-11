import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateMoneyTransferApiRequest, CreateMoneyTransferApiResponse } from './types';
export type LoadMoneyTransferApiResponse = {
  "id": number
  "name": null,
  "description": string
  "sourceCurrancy": number
  "sourceSum": number
  "destinationCurrancy": number
  "destinationSum": number
  "date": string
  "apartament_id": number
  "creator_id": number
  "created_at": string
  "updated_at": string
  "middleTransfers": null,
  "rate": number
}

@Injectable({
  providedIn: 'root'
})
export class MoneyTransferService {

  constructor(
    private http: HttpClient

  ) { }

  load(): Observable<LoadMoneyTransferApiResponse[]> {
    return this.http.get<LoadMoneyTransferApiResponse[]>(`moneyTransfer`)
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
