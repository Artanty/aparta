import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { orderBy } from '../../helpers';

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
        this. allFeesLoaded = true
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
        this.apartamentFeesLoaded = true
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
          localStorage.removeItem('allFees')
          if (this.apartamentFeesLoaded){
            let storeApartamentFees = this.apartamentFeesSubj.getValue()
            storeApartamentFees.push(res)
            this.setApartamentFees(orderBy(storeApartamentFees,'paidDate', 'asc'))
          }
          if (this.allFeesLoaded){
            let storeAllFees = this.allFeesSubj.getValue()
            storeAllFees.push(res)
            this.setAllFees(orderBy(storeAllFees,'paidDate', 'asc'))
          }
        }
      })
    )
  }

  update(data: any) {
    return this.http.put(`apartamentFee/${data.id}`, data).pipe(
      tap({
        next: (res: any) => {
          localStorage.removeItem('apartamentFees')
          localStorage.removeItem('allFees')
          let storeApartamentFees = this.apartamentFeesSubj.getValue()
          storeApartamentFees = storeApartamentFees.map((el: any) => {
            if (el.id === res.id) {
              el = { ...el, ...res }
            }
            return el
          })
          this.setApartamentFees(storeApartamentFees)
          let storeAllFees = this.allFeesSubj.getValue()
          storeAllFees = storeAllFees.map((el: any) => {
            if (el.id === res.id) {
              el = { ...el, ...res }
            }
            return el
          })
          this.setAllFees(storeAllFees)
        }
      })
    )
  }

  delete(id: number) {

    return this.http.delete(`apartamentFee/${id}`).pipe(
      tap({
        next: (res:any) => {
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

  getFee(id: number): Observable<any>{
    return this.http.get<any[]>(`apartamentFee/${id}`)
  }

  clear () {
    this.setAllFees([])
    this.setApartamentFees([])
    this.setApartamentFeesLoading(false)
    localStorage.removeItem('apartamentFees')
    localStorage.removeItem('allFees')
    localStorage.removeItem('apartamentFeeList')
  }
}
