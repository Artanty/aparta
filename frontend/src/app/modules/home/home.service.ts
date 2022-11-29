import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { orderBy } from '../shared/helpers';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(
    private http: HttpClient
  ) { }

  getFeesOfApartamentOfYear(a_id: number, year: number): Observable<any>{
    console.log(111)
    return this.http.get<any[]>(`apartament/getApartamentFees/${a_id}?year=${year}`).pipe(
      tap((res: any) => {
        localStorage.setItem('apartamentFees', JSON.stringify(res))
      })
    )
  }
}
