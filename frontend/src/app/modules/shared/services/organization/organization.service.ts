import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrganizationService {

  private organizationSubj: BehaviorSubject<any> = new BehaviorSubject<any>([])
  organizations$: Observable<any[]> = this.organizationSubj.asObservable()

  private organizationsLoadingSubj: BehaviorSubject<boolean> = new BehaviorSubject<any>(false)
  organizationsLoading$: Observable<boolean> = this.organizationsLoadingSubj.asObservable()

  constructor(
    private http: HttpClient
  ) {}

  setOrganizations (val: any) {
    this.organizationSubj.next(val)
  }

  setOrganizationsLoading (val: boolean) {
    this.organizationsLoadingSubj.next(val)
  }

  getOrganizations(force?: boolean): Observable<any>{
    let obs$: Observable<any>
    const storeItems = this.organizationSubj.getValue()
    const storageItems = localStorage.getItem('organizations')
    if (storeItems?.length && !force) {
      obs$ = of(storeItems)
    } else if (storageItems && !force) {
      obs$ = of(JSON.parse(storageItems))
    } else {
      obs$ = this.http.get<any[]>(`organization`)
    }
    return obs$.pipe(
      tap((res: any) => {
        localStorage.setItem('organizations', JSON.stringify(res))
        this.setOrganizations(res)
      })
    )
  }

  create(data: any) {
    return this.http.post(`organization`, data).pipe(
      tap({
        next: (res: any) => {
          localStorage.removeItem('organizations')
          let storeItems = this.organizationSubj.getValue()
          storeItems = storeItems.push(res)
          this.setOrganizations(storeItems)
        }
      })
    )
  }

  delete(id: number) {
    return this.http.delete(`organization/${id}`).pipe(
      tap({
        next: () => {
          localStorage.removeItem('organizations')
          let storeItems = this.organizationSubj.getValue()
          storeItems = storeItems.filter((el: any) => el.id !== id)
          this.setOrganizations(storeItems)
        }
      })
    )
  }

  clear() {
    this.setOrganizations([])
    this.setOrganizationsLoading(false)
    localStorage.removeItem('organizations')
  }
}
