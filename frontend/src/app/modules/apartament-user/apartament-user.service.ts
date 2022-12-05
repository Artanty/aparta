import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApartamentUserService {


    private apartamentUsersSubj: BehaviorSubject<any> = new BehaviorSubject<any>([])
    apartamentUsers$: Observable<any[]> = this.apartamentUsersSubj.asObservable()

    private apartamentUsersLoadingSubj: BehaviorSubject<boolean> = new BehaviorSubject<any>(false)
    apartamentUsersLoading$: Observable<boolean> = this.apartamentUsersLoadingSubj.asObservable()

    constructor(
      private http: HttpClient
    ) { }

    setApartamentUsers (val: any) {
      this.apartamentUsersSubj.next(val)
    }

    setApartamentUsersLoading (val: boolean) {
      this.apartamentUsersLoadingSubj.next(val)
    }

    getApartamentUsers(apartament_id: number, force?: boolean): Observable<any>{
      let obs$: Observable<any>
      const storeItems = this.apartamentUsersSubj.getValue()
      if (storeItems?.length && !force) {
        obs$ = of(storeItems)
      } else {
        obs$ = this.http.get<any[]>(`apartament/getApartamentUsers/${apartament_id}`)
      }
      return obs$.pipe(
        tap((res: any) => {
          this.setApartamentUsers(res)
        })
      )
    }

    createApartamentUser(data: any) {
      return this.http.post(`apartamentUser`, data).pipe(
        tap({
          next: (res: any) => {
            let storeItems = this.apartamentUsersSubj.getValue()
            storeItems = storeItems.push(res)
            this.setApartamentUsers(storeItems)
          }
        })
      )
    }

    // update(data: any) {
    //   return this.http.put(`feeTemplate/${data.id}`, data).pipe(
    //     tap({
    //       next: (res: any) => {
    //         localStorage.removeItem('feeTemplates')
    //         let storeItems = this.feeTemplatesSubj.getValue()
    //         storeItems = storeItems.map((el: any) => {
    //           if (el.id === res.id) {
    //             el = { ...el, ...res }
    //           }
    //           return el
    //         })
    //         this.setFeeTemplates(storeItems)
    //       }
    //     })
    //   )
    // }

    // delete(id: number) {
    //   return this.http.delete(`feeTemplate/${id}`).pipe(
    //     tap({
    //       next: () => {
    //         localStorage.removeItem('feeTemplates')
    //         let storeItems = this.apartamentUsersSubj.getValue()
    //         storeItems = storeItems.filter((el: any) => el.id !== id)
    //         this.setApartamentUsers(storeItems)
    //       }
    //     })
    //   )
    // }

    // getFeeTemplate(id: number): Observable<any>{
    //   return this.http.get<any[]>(`feeTemplate/${id}`)
    // }
  }
