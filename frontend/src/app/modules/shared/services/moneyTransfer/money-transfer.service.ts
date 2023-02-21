import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
export type LoadMoneyTransferApiResponse = {
  "id": number
  "name": string | null,
  "description": string
  "currancy1": number
  "sum1": number
  "currancy2": number
  "sum2": number
  "currancy3": number | null
  "sum3": number | null
  "currancy4": number | null
  "sum4": number | null
  "date": string
  "apartament_id": number
  "creator_id": number
  "created_at": string
  "updated_at": string
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

  create(data: any) {
    return this.http.post(`moneyTransfer`, data)
  }

  update(data: any) {
    return this.http.put(`moneyTransfer/${data.id}`, data)
  }

  delete(id: number) {
    return this.http.delete(`moneyTransfer/${id}`)
  }
}
