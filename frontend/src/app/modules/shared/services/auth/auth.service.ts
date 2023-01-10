import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ApartamentFeeService } from 'src/app/modules/shared/services/apartamentFee/apartament-fee.service';
import { ApartamentUserService } from 'src/app/modules/apartament-user/apartament-user.service';
import { ApartamentService } from '../apartament/apartament.service';
import { FeeTemplateService } from '../feeTemplate/fee-template.service';
import { MessageService } from '../message/message.service';
import { OrganizationService } from '../organization/organization.service';
import { OrganizationTariffService } from '../organizationTariff/organization-tariff.service';

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

  constructor(
    private ApartamentServ: ApartamentService,
    private ApartamentUserServ: ApartamentUserService,
    private ApartamentFeeServ: ApartamentFeeService,
    private FeeTemplateServ: FeeTemplateService,
    private OrganizationServ: OrganizationService,
    private OrganizationTariffServ: OrganizationTariffService,
    private MessageServ: MessageService
  ) { }

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

  getToken(): string | null {
    try {
      return localStorage.getItem('token')
    } catch (error) {
      console.log(error)
      return null
    }
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
