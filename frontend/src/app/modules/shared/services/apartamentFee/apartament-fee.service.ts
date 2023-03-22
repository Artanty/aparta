import { HttpClient } from '@angular/common/http';
import { Injectable, isDevMode } from '@angular/core';
import { BehaviorSubject, finalize, Observable, of, tap } from 'rxjs';
import { isMock, orderBy } from '../../helpers';
import { getApartamentFeesApiResponseMock } from './mock';
import { ApartamentFeeCreateApiRequest, ApartamentFeeCreateApiResponse, GetFeesApiResponseItem, UpdateFeeApiReqest } from './types';
export type GetFeesApiRequest = {
  apartament_id: number | string,
  force: boolean
  dateFrom: string | null
  dateTo: string | null
} // not used
@Injectable({
  providedIn: 'root'
})
export class ApartamentFeeService {
  private feesSubj: BehaviorSubject<GetFeesApiResponseItem[]> = new BehaviorSubject<GetFeesApiResponseItem[]>([])
  fees$: Observable<GetFeesApiResponseItem[]> = this.feesSubj.asObservable()

  private loadingSubj$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true)
  loading$: Observable<boolean> = this.loadingSubj$.asObservable()

  private copiedApartamentSubj: BehaviorSubject<ApartamentFeeCreateApiRequest | null> = new BehaviorSubject<ApartamentFeeCreateApiRequest | null>(null)
  copiedApartamentSubj$: Observable<any> = this.copiedApartamentSubj.asObservable()

  apartamentFeesLoaded: boolean = false
  allFeesLoaded: boolean = false

  constructor(
    private http: HttpClient
  ) { }

  setCopiedApartament (data: ApartamentFeeCreateApiRequest | null) {
    this.copiedApartamentSubj.next(data)
  }
  getCopiedApartament (): ApartamentFeeCreateApiRequest | null{
    return this.copiedApartamentSubj.getValue()
  }

  setFees (val: GetFeesApiResponseItem[]) {
    this.feesSubj.next(val)
  }

  setLoading (val: boolean) {
    this.loadingSubj$.next(val)
  }

  // dateFrom: string | null = null, dateTo: string | null = null
  getFees(a_id: number | string, force: boolean = false, year: number): Observable<GetFeesApiResponseItem[]>{
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
        obs$ = this.http.get<GetFeesApiResponseItem[]>(`apartamentFee/?year=${year}`)
      } else {
        // ?dateFrom=${dateFrom}&dateTo=${dateTo}
        if (isDevMode() && isMock()) {
          obs$ = of (getApartamentFeesApiResponseMock)
        } else {
          obs$ = this.http.get<GetFeesApiResponseItem[]>(`apartament/getApartamentFees/${a_id}?year=${year}`)
        }
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

  create(data: ApartamentFeeCreateApiRequest): Observable<ApartamentFeeCreateApiResponse> {
    return this.http.post<ApartamentFeeCreateApiResponse>(`apartamentFee`, data).pipe(
      tap({
        next: (res: ApartamentFeeCreateApiResponse) => {
          localStorage.removeItem('fees')
          let storeFees = this.feesSubj.getValue()
          storeFees.push(res)
          this.setFees(orderBy(storeFees, 'paidDate', 'asc'))
        }
      })
    )
  }

  update(data: UpdateFeeApiReqest) {
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

  getFee(id: number): Observable<GetFeesApiResponseItem>{
    this.setLoading(true)
    return this.http.get<GetFeesApiResponseItem>(`apartamentFee/${id}`).pipe(
      finalize(() => {
        this.setLoading(false)
      })
    )
  }

  clear () {
    this.setFees([])
    this.setLoading(false)
    localStorage.removeItem('apartamentFeeList')
    localStorage.removeItem('fees')
  }
}
