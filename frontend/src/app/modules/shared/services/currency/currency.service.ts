import { Injectable } from '@angular/core';
import { TCurrencyPipe } from '@pipes/currency-value/types';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApartamentFeeCreateApiRequest } from '../apartamentFee/types';
import { Entries } from '../types';

export type TCurrencyPipeStore = {
  [key: string]: TCurrencyPipe
}

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {

  private currencyPipeStoreSubj: BehaviorSubject<TCurrencyPipeStore> = new BehaviorSubject<TCurrencyPipeStore>({})
  currencyPipeStore$: Observable<TCurrencyPipeStore> = this.currencyPipeStoreSubj.asObservable()

  constructor() { }

  makeKey = (feeId: number, year: number, currancy: number): string | keyof TCurrencyPipeStore => String(feeId) + '_' + String(year) + '_' + String(currancy)

  setCurrencyPipeResult (feeId: number, year: number, currancy: number, pipeResult: TCurrencyPipe) {
    const key: string | keyof TCurrencyPipeStore = this.makeKey(feeId, year, currancy)
    const storeObj = this.getCurrencyPipe()
    if (!storeObj.hasOwnProperty(key)) {
      storeObj[key] = pipeResult
    }
    this.setCurrencyPipe(storeObj)
  }

  getCurrencyPipeResult (feeId: number, year: number, currancy: number): TCurrencyPipe | null {
    const key: string | keyof TCurrencyPipeStore = this.makeKey(feeId, year, currancy)
    const storeObj = this.getCurrencyPipe()
    if (!storeObj.hasOwnProperty(key)) {
      return null
    } else {
      return storeObj[key]
    }
  }

  setCurrencyPipe (data: TCurrencyPipeStore) {
    this.currencyPipeStoreSubj.next(data)
  }

  getCurrencyPipe (): TCurrencyPipeStore {
    return this.currencyPipeStoreSubj.getValue()
  }
}
