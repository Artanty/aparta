import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, of, Subject, tap } from 'rxjs';
import { GetApartamentsApiResponse } from './apartament-list/apartament-list.component';
import { ApartamentModule } from './apartament.module'

@Injectable({
  providedIn: 'root'
})
export class ApartamentService {

  private apartamentsSubj: BehaviorSubject<any> = new BehaviorSubject<any>([])
  apartaments$: Observable<any[]> = this.apartamentsSubj.asObservable()

  private apartamentsLoadingSubj: BehaviorSubject<boolean> = new BehaviorSubject<any>(false)
  apartamentsLoading$: Observable<boolean> = this.apartamentsLoadingSubj.asObservable()

  constructor(
    private http: HttpClient,
  ) { }

  setApartaments (val: any) {
    this.apartamentsSubj.next(val)
  }

  setApartamentsLoading (val: boolean) {
    this.apartamentsLoadingSubj.next(val)
  }

  getApartaments(force?: boolean): Observable<any>{
    let obs$: Observable<any>
    const storeItems = this.apartamentsSubj.getValue()
    const storageItems = localStorage.getItem('apartaments')
    if (storeItems?.length && !force) {
      console.log(10000000000000)
      obs$ = of(storeItems)
    } else if (storageItems && !force) {
      obs$ = of(JSON.parse(storageItems))
    } else {
      obs$ = this.http.get<GetApartamentsApiResponse[]>(`apartament`)
    }
    return obs$.pipe(
      tap((res: any) => {
        localStorage.setItem('apartaments', JSON.stringify(res))
        this.setApartaments(res)
      })
    )
  }

  async clearApartaments () {
    return new Promise<void>(resolve => {
      localStorage.removeItem('apartaments')
      this.setApartaments([])
      return resolve()
    })
  }

  removeItemFromStore(id: number){
    localStorage.removeItem('apartaments')
    let storeItems = this.apartamentsSubj.getValue()
    if (storeItems?.length){
      storeItems = storeItems.filter((el: any) => el.id !== id)
      this.setApartaments(storeItems)
    }
  }

  delete(id: number) {
    return this.http.delete(`apartament/${id}`)
  }

}
