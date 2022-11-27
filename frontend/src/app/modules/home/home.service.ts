import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, of, Subject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor() { }

  // getApartaments(force?: boolean): Observable<any>{
  //   let obs$: Observable<any>
  //   const storeItems = this.apartamentsSubj.getValue()
  //   const storageItems = localStorage.getItem('apartaments')
  //   if (storeItems?.length && !force) {
  //     obs$ = of(storeItems)
  //   } else if (storageItems && !force) {
  //     obs$ = of(JSON.parse(storageItems))
  //   } else {
  //     obs$ = this.http.get<any[]>(`apartament`)
  //   }
  //   return obs$.pipe(
  //     tap((res: any) => {
  //       localStorage.setItem('apartaments', JSON.stringify(res))
  //       this.setApartaments(res)
  //     })
  //   )
  // }
}
