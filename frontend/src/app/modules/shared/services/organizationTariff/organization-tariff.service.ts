import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrganizationTariffService {
  private organizationTariffSubj: BehaviorSubject<any> = new BehaviorSubject<any>([])
  organizationTariffs$: Observable<any[]> = this.organizationTariffSubj.asObservable()

  private organizationTariffsLoadingSubj: BehaviorSubject<boolean> = new BehaviorSubject<any>(false)
  organizationTariffsLoading$: Observable<boolean> = this.organizationTariffsLoadingSubj.asObservable()

  constructor(
    private http: HttpClient
  ) { }

  setOrganizationTariffs (val: any) {
    this.organizationTariffSubj.next(val)
  }

  setOrganizationTariffsLoading (val: boolean) {
    this.organizationTariffsLoadingSubj.next(val)
  }

  getOrganizationTariffs(force?: boolean): Observable<any>{
    let obs$: Observable<any>
    const storeItems = this.organizationTariffSubj.getValue()
    const storageItems = localStorage.getItem('organizationTariffs')
    if (storeItems?.length && !force) {
      obs$ = of(storeItems)
    } else if (storageItems && !force) {
      obs$ = of(JSON.parse(storageItems))
    } else {
      obs$ = this.http.get<any[]>(`organizationTariff`)
    }
    return obs$.pipe(
      tap((res: any) => {
        localStorage.setItem('organizationTariffs', JSON.stringify(res))
        this.setOrganizationTariffs(res)
      })
    )
  }

  create(data: any) {
    return this.http.post(`organizationTariff`, data).pipe(
      tap({
        next: (res: any) => {
          localStorage.removeItem('organizationTariffs')
          let storeItems = this.organizationTariffSubj.getValue()
          storeItems = storeItems.push(res)
          this.setOrganizationTariffs(storeItems)
        }
      })
    )
  }

  delete(id: number) {
    return this.http.delete(`organizationTariff/${id}`).pipe(
      tap({
        next: () => {
          localStorage.removeItem('organizationTariffs')
          let storeItems = this.organizationTariffSubj.getValue()
          storeItems = storeItems.filter((el: any) => el.id !== id)
          this.setOrganizationTariffs(storeItems)
        }
      })
    )
  }
  clear() {
    this.setOrganizationTariffs([])
    this.setOrganizationTariffsLoading(false)
    localStorage.removeItem('organizationTariffs')
  }
}
