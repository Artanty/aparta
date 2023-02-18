import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ApartamentFeeService } from 'src/app/modules/shared/services/apartamentFee/apartament-fee.service';
import { ApartamentUserService } from 'src/app/modules/apartament-user/apartament-user.service';
import { ApartamentService } from '../apartament/apartament.service';
import { FeeTemplateService } from '../feeTemplate/fee-template.service';
import { MessageService } from '../message/message.service';
import { OrganizationService } from '../organization/organization.service';
import { OrganizationTariffService } from '../organizationTariff/organization-tariff.service';
import { HttpClient } from '@angular/common/http';

export type User = {
  "id": number
  "name": string
  "email": string
  "email_verified_at": string | null,
  "created_at": string
  "updated_at": string | null
}
export type UserLoginApiResponse = {
  "user": User,
  "token": string
}
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userBs: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null)
  user$: Observable<User | null> = this.userBs.asObservable()

  /**
   * Determines user logged in or not
   * Set token
   * Clears token
   * Receives token
   */
  isLoggedIn(): boolean {
    return !!this.getToken()
  }

  constructor(
    private ApartamentServ: ApartamentService,
    private ApartamentUserServ: ApartamentUserService,
    private ApartamentFeeServ: ApartamentFeeService,
    private FeeTemplateServ: FeeTemplateService,
    private OrganizationServ: OrganizationService,
    private OrganizationTariffServ: OrganizationTariffService,
    private MessageServ: MessageService,
    private http: HttpClient
  ) { }

  setTokenAndUser (user: UserLoginApiResponse) {
    this.setToken(user.token)
    this.setUser(user.user)
  }

  setUser (user: User | null) {
    this.userBs.next(user)
  }

  getUser (): User | null {
    return this.userBs.getValue()
  }

  getAccess ({ users = [] } : { users?: number[] }): boolean {
    let result = false
    const currentUser = this.getUser()
    if (currentUser) {
      if (users && Array.isArray(users) && users.length) {
        users.forEach((el: number) => {
          if (el === currentUser.id) {
            result = true
          }
        })
      }
    }
    return result
  }

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
    this.clearAllStorages()
  }

  getToken (): string | null {
    try {
      return localStorage.getItem('token')
    } catch (error) {
      console.log(error)
      return null
    }
  }

  loadUser(): Observable<User> {
    return this.http.post<User>(`getUser`, null).pipe(
      tap((res: User) => {
        this.setUser(res)
      })
    )
  }

  getUserId () {
    return 1
  }
  clearAllStorages() {
    this.ApartamentServ.clear()
    this.ApartamentUserServ.clear()
    this.ApartamentFeeServ.clear()
    this.FeeTemplateServ.clear()
    this.OrganizationServ.clear()
    this.OrganizationTariffServ.clear()
    this.MessageServ.clear()
  }
}
