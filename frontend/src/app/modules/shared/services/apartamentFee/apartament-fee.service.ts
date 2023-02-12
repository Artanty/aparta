import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, finalize, Observable, of, tap } from 'rxjs';
import { orderBy } from '../../helpers';
import { GetFeesApiResponseItem } from './types';

@Injectable({
  providedIn: 'root'
})
export class ApartamentFeeService {
  private feesSubj: BehaviorSubject<GetFeesApiResponseItem[]> = new BehaviorSubject<GetFeesApiResponseItem[]>([])
  fees$: Observable<GetFeesApiResponseItem[]> = this.feesSubj.asObservable()

  private loadingSubj$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true)
  loading$: Observable<boolean> = this.loadingSubj$.asObservable()

  private copiedApartamentSubj: BehaviorSubject<any> = new BehaviorSubject<any>(null)
  copiedApartamentSubj$: Observable<any> = this.copiedApartamentSubj.asObservable()

  apartamentFeesLoaded: boolean = false
  allFeesLoaded: boolean = false

  constructor(
    private http: HttpClient
  ) { }

  setCopiedApartament (data: any) {
    this.copiedApartamentSubj.next(data)
  }
  getCopiedApartament (): any {
    return this.copiedApartamentSubj.getValue()
  }

  setFees (val: GetFeesApiResponseItem[]) {
    this.feesSubj.next(val)
  }

  setLoading (val: boolean) {
    this.loadingSubj$.next(val)
  }

  getFees(a_id: number | string, force?: boolean): Observable<GetFeesApiResponseItem[]>{
    this.setLoading(true)
    let obs$: Observable<any>
    const storeItems = this.feesSubj.getValue()
    const storageItems = localStorage.getItem('fees')
    if (storeItems?.length && !force) {
      obs$ = of(storeItems)
    } else if (storageItems && !force) {
      obs$ = of(JSON.parse(storageItems))
    } else {
      if (a_id === 'all') {
        obs$ = this.http.get<GetFeesApiResponseItem[]>(`apartamentFee`)
      } else {
        obs$ = this.http.get<GetFeesApiResponseItem[]>(`apartament/getApartamentFees/${a_id}`)
      }
    }
    return obs$.pipe(
      tap((res: GetFeesApiResponseItem[]) => {
        localStorage.setItem('fees', JSON.stringify(res))
        this.setFees(res)
        if (a_id === 'all') {
          this.allFeesLoaded = true
          this.apartamentFeesLoaded = false
        } else {
          this.allFeesLoaded = false
          this.apartamentFeesLoaded = true
        }
      }),
      finalize(() => {
        this.setLoading(false)
      })
    )
  }

  ifFeeLoaded(items: any[], a_id: number): boolean {
    let result = false
    if (Array.isArray(items) && items.length){
      result = !!items.find((el: any) => el.apartament_id === a_id)
    }
    return result
  }

  create(data: any) {
    return this.http.post(`apartamentFee`, data).pipe(
      tap({
        next: (res: any) => {
          localStorage.removeItem('fees')
          let storeFees = this.feesSubj.getValue()
          storeFees.push(res)
          this.setFees(orderBy(storeFees, 'paidDate', 'asc'))
        }
      })
    )
  }

  update(data: any) {
    return this.http.put(`apartamentFee/${data.id}`, data).pipe(
      tap({
        next: (res: any) => {
          localStorage.removeItem('fees')
          let storeFees = this.feesSubj.getValue()
          storeFees = storeFees.map((el: any) => {
            if (el.id === res.id) {
              el = { ...el, ...res }
            }
            return el
          })
          this.setFees(storeFees)
        }
      })
    )
  }

  delete(id: number) {
    return this.http.delete(`apartamentFee/${id}`).pipe(
      tap({
        next: (res: any) => {
          localStorage.removeItem('fees')
          let storeFees = this.feesSubj.getValue()
          storeFees = storeFees.filter((el: any) => el.id !== id)
          this.setFees(storeFees)
        }
      })
    )
  }

  getFee(id: number): Observable<any>{
    return this.http.get<any[]>(`apartamentFee/${id}`)
  }

  clear () {
    this.setFees([])
    this.setLoading(false)
    localStorage.removeItem('apartamentFeeList')
    localStorage.removeItem('fees')
  }
}
