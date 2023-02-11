import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { orderBy } from '../../helpers';

@Injectable({
  providedIn: 'root'
})
export class ApartamentFeeService {
  private feesSubj: BehaviorSubject<any> = new BehaviorSubject<any>([])
  fees$: Observable<any[]> = this.feesSubj.asObservable()

  private loadingSubj$: BehaviorSubject<boolean> = new BehaviorSubject<any>(false)
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

  setFees (val: any) {
    this.feesSubj.next(val)
  }

  setLoading (val: boolean) {
    this.loadingSubj$.next(val)
  }

  getFees(a_id: number | string, force?: boolean): Observable<any>{
    let obs$: Observable<any>
    const storeItems = this.feesSubj.getValue()
    const storageItems = localStorage.getItem('fees')
    if (storeItems?.length && !force) {
      obs$ = of(storeItems)
    } else if (storageItems && !force) {
      obs$ = of(JSON.parse(storageItems))
    } else {
      if (a_id === 'all') {
        obs$ = this.http.get<any[]>(`apartamentFee`)
      } else {
        obs$ = this.http.get<any[]>(`apartament/getApartamentFees/${a_id}`)
      }
    }
    return obs$.pipe(
      tap((res: any) => {
        localStorage.setItem('fees', JSON.stringify(res))
        this.setFees(res)
        if (a_id === 'all') {
          this.allFeesLoaded = true
          this.apartamentFeesLoaded = false
        } else {
          this.allFeesLoaded = false
          this.apartamentFeesLoaded = true
        }

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
          this.setFees(orderBy(storeFees,'paidDate', 'asc'))
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
