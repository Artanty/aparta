import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MoneyTransferService {

  constructor(
    private http: HttpClient

  ) { }

  load() {
    return this.http.get(`moneyTransfer`)
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
