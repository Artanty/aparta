import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  /**
   * Determines user logged in or not
   * Set token
   * Clears token
   * Receives token
   */
  isLoggedIn(): boolean {
    return !!this.getToken()
  }

  constructor() { }

  setToken(token: string) {
    try {
      if (token) {
        localStorage.setItem('token', token)
      }
    } catch (error) {
      console.log(error)
    }
  }
  clearToken(){
    localStorage.removeItem('token')
  }

  getToken(): string | null {
    try {
      return localStorage.getItem('token')
    } catch (error) {
      console.log(error)
      return null
    }
  }

}
