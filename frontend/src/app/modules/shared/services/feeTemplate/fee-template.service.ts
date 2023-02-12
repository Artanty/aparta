import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { FeeTemplateApiResponseItem } from './types';

@Injectable({
  providedIn: 'root'
})
export class FeeTemplateService {

  private feeTemplatesSubj: BehaviorSubject<FeeTemplateApiResponseItem[]> = new BehaviorSubject<FeeTemplateApiResponseItem[]>([])
  feeTemplates$: Observable<FeeTemplateApiResponseItem[]> = this.feeTemplatesSubj.asObservable()

  private feeTemplatesLoadingSubj: BehaviorSubject<boolean> = new BehaviorSubject<any>(false)
  feeTemplatesLoading$: Observable<boolean> = this.feeTemplatesLoadingSubj.asObservable()

  constructor(
    private http: HttpClient
  ) { }

  setFeeTemplates (val: FeeTemplateApiResponseItem[]) {
    this.feeTemplatesSubj.next(val)
  }

  setFeeTemplatesLoading (val: boolean) {
    this.feeTemplatesLoadingSubj.next(val)
  }

  getFeeTemplates(force?: boolean): Observable<FeeTemplateApiResponseItem[]>{
    let obs$: Observable<FeeTemplateApiResponseItem[]>
    const storeItems = this.feeTemplatesSubj.getValue()
    const storageItems = localStorage.getItem('feeTemplates')
    if (storeItems?.length && !force) {
      obs$ = of(storeItems)
    } else if (storageItems && !force) {
      obs$ = of(JSON.parse(storageItems))
    } else {
      obs$ = this.http.get<FeeTemplateApiResponseItem[]>(`feeTemplate`)
    }
    return obs$.pipe(
      tap((res: FeeTemplateApiResponseItem[]) => {
        localStorage.setItem('feeTemplates', JSON.stringify(res))
        this.setFeeTemplates(res)
      })
    )
  }

  create(data: any) {
    return this.http.post(`feeTemplate`, data).pipe(
      tap({
        next: (res: any) => {
          localStorage.removeItem('feeTemplates')
          let storeItems = this.feeTemplatesSubj.getValue()
          storeItems.push(res)
          this.setFeeTemplates(storeItems)
        }
      })
    )
  }

  update(data: any) {
    return this.http.put(`feeTemplate/${data.id}`, data).pipe(
      tap({
        next: (res: any) => {
          localStorage.removeItem('feeTemplates')
          let storeItems = this.feeTemplatesSubj.getValue()
          storeItems = storeItems.map((el: any) => {
            if (el.id === res.id) {
              el = { ...el, ...res }
            }
            return el
          })
          this.setFeeTemplates(storeItems)
        }
      })
    )
  }

  delete(id: number) {
    return this.http.delete(`feeTemplate/${id}`).pipe(
      tap({
        next: () => {
          localStorage.removeItem('feeTemplates')
          let storeItems = this.feeTemplatesSubj.getValue()
          storeItems = storeItems.filter((el: any) => el.id !== id)
          this.setFeeTemplates(storeItems)
        }
      })
    )
  }

  getFeeTemplate(id: number): Observable<any>{
    return this.http.get<any[]>(`feeTemplate/${id}`)
  }
  clear() {
    this.setFeeTemplates([])
    this.setFeeTemplatesLoading(false)
    localStorage.removeItem('feeTemplates')
  }
}
