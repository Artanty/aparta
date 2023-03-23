import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThrottleService {

private throttleStoreSubj: BehaviorSubject<{ [key: string]: string }> = new BehaviorSubject<{ [key: string]: string }>({})
throttleStore$: Observable<{ [key: string]: string }> = this.throttleStoreSubj.asObservable()

  constructor() { }

  isThrottled (name: string): boolean {
    // console.log(name)
    const store = this.getThrottleStore()
    return store.hasOwnProperty(name)
  }

  add (name: string, args: any) {
    const store = this.getThrottleStore()
    store[name] = args
    this.setThrottleStore(store)
  }

  clear (name: string): void {
    const store = this.getThrottleStore()
    delete store[name]
  }

  setThrottleStore (data: { [key: string]: string }) {
    this.throttleStoreSubj.next(data)
  }

  getThrottleStore (): { [key: string]: string } {
    return this.throttleStoreSubj.getValue()
  }
}
