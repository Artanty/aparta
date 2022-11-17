import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApartamentFeeService {
  private allFeesSubj: BehaviorSubject<any> = new BehaviorSubject<any>([])
  allFees$: Observable<any[]> = this.allFeesSubj.asObservable()

  private apartamentFeesSubj: BehaviorSubject<any> = new BehaviorSubject<any>([])
  apartamentFees$: Observable<any[]> = this.apartamentFeesSubj.asObservable()

  private apartamentFeesLoadingSubj: BehaviorSubject<boolean> = new BehaviorSubject<any>(false)
  apartamentFeesLoading$: Observable<boolean> = this.apartamentFeesLoadingSubj.asObservable()

  constructor(
    private http: HttpClient
  ) { }

  setAllFees (val: any) {
    this.allFeesSubj.next(val)
  }

  setApartamentFees (val: any) {
    this.apartamentFeesSubj.next(val)
  }

  setApartamentFeesLoading (val: boolean) {
    this.apartamentFeesLoadingSubj.next(val)
  }

  getAllFees(force?: boolean): Observable<any>{
    let obs$: Observable<any>
    const storeItems = this.allFeesSubj.getValue()
    const storageItems = localStorage.getItem('allFees')
    if (storeItems?.length && !force) {
      obs$ = of(storeItems)
    } else if (storageItems && !force) {
      obs$ = of(JSON.parse(storageItems))
    } else {
      obs$ = this.http.get<any[]>(`apartamentFee`)
    }
    return obs$.pipe(
      tap((res: any) => {
        localStorage.setItem('allFees', JSON.stringify(res))
        this.setAllFees(res)
      })
    )
  }

  getFeesOfApartament(a_id: number, force?: boolean): Observable<any>{
    let obs$: Observable<any>
    const storeItems = this.apartamentFeesSubj.getValue()
    const storageItems = localStorage.getItem('apartamentFees')
    if (storeItems?.length && this.ifFeeLoaded(storeItems, a_id) && !force) {
      obs$ = of(storeItems)
    } else if (storageItems && this.ifFeeLoaded(JSON.parse(storageItems), a_id) && !force) {
      obs$ = of(JSON.parse(storageItems))
    } else {
      obs$ = this.http.get<any[]>(`apartament/getApartamentFees/${a_id}`)
    }
    return obs$.pipe(
      tap((res: any) => {
        localStorage.setItem('apartamentFees', JSON.stringify(res))
        this.setApartamentFees(res)
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

  create(data: any) { //apartamentFeeOnly
    return this.http.post(`apartamentFee`, data).pipe(
      tap({
        next: (res: any) => {
          localStorage.removeItem('apartamentFees')
          let storeApartamentFees = this.apartamentFeesSubj.getValue()
          storeApartamentFees = storeApartamentFees.push(res)
          this.setApartamentFees(storeApartamentFees)
        }
      })
    )
  }

  delete(id: number) {
    return this.http.delete(`apartamentFee/${id}`).pipe(
      tap({
        next: () => {
          localStorage.removeItem('apartamentFees')
          localStorage.removeItem('allFees')
          let storeApartamentFees = this.apartamentFeesSubj.getValue()
          storeApartamentFees = storeApartamentFees.filter((el: any) => el.id !== id)
          this.setApartamentFees(storeApartamentFees)
          let storeAllFees = this.allFeesSubj.getValue()
          storeAllFees = storeAllFees.filter((el: any) => el.id !== id)
          this.setAllFees(storeAllFees)
        }
      })
    )
  }
}
