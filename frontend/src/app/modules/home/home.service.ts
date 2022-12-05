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
    return this.http.get<any[]>(`apartament/getApartamentFees2/${a_id}?year=${year}`)
  }

  getFeesOfApartamentGroupedBy(a_id: number, yearFrom: number, yearTo: number, groupBy: string = 'year'): Observable<any>{
    let request = `apartament/getApartamentFees2/${a_id}?groupBy=${groupBy}`
    if (yearFrom && yearTo) {
      request += `&yearFrom=${yearFrom}&yearTo=${yearTo}`
    }
    return this.http.get<any[]>(request)
  }
}
