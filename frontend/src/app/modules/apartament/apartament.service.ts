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

  constructor(
    private http: HttpClient,
  ) { }

  setApartaments (val: any) {
    console.log('set store Apartaments')
    this.apartamentsSubj.next(val)
  }

  getApartaments(force?: boolean): Observable<any>{
    let obs$: Observable<any>
    const storeItems = this.apartamentsSubj.getValue()
    const storageItems = localStorage.getItem('apartaments')
    if (storeItems?.length && !force) {
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

  delete(id: number) {
    return this.http.delete(`apartament/${id}`)
  }

}
