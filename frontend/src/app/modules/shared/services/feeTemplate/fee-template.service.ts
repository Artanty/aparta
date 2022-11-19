import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FeeTemplateService {

  private feeTemplatesSubj: BehaviorSubject<any> = new BehaviorSubject<any>([])
  feeTemplates$: Observable<any[]> = this.feeTemplatesSubj.asObservable()

  private feeTemplatesLoadingSubj: BehaviorSubject<boolean> = new BehaviorSubject<any>(false)
  feeTemplatesLoading$: Observable<boolean> = this.feeTemplatesLoadingSubj.asObservable()

  constructor(
    private http: HttpClient
  ) { }

  setFeeTemplates (val: any) {
    this.feeTemplatesSubj.next(val)
  }

  setFeeTemplatesLoading (val: boolean) {
    this.feeTemplatesLoadingSubj.next(val)
  }

  getFeeTemplates(force?: boolean): Observable<any>{
    let obs$: Observable<any>
    const storeItems = this.feeTemplatesSubj.getValue()
    const storageItems = localStorage.getItem('feeTemplates')
    if (storeItems?.length && !force) {
      obs$ = of(storeItems)
    } else if (storageItems && !force) {
      obs$ = of(JSON.parse(storageItems))
    } else {
      obs$ = this.http.get<any[]>(`feeTemplate`)
    }
    return obs$.pipe(
      tap((res: any) => {
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
          storeItems = storeItems.push(res)
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
}
