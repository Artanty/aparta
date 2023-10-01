import { Injectable } from '@angular/core';
import { StorageInterface } from '@shared/interfaces/Storage';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService implements StorageInterface{
  public setItem<T>(key: string, value: T): void {
    const stringValue = String(value)
    localStorage.setItem(key, stringValue);
  }
  public getItem<T>(key: string): T | null {
    const item = localStorage.getItem(key);
    let value = null
    if (item) {
      try {
        value = JSON.parse(item)
      } catch (e){
        // console.log(e)
      }
      if (value !== null && typeof value === 'object') {
        return value
      } else {
        return item as T
      }
    }
    return null
  }
  constructor() { }
}
