import { ApartamentService } from './../../shared/services/apartament/apartament.service';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common'
import { MessageService } from '../../shared/services/message/message.service';
import { FeeTemplateService } from '../../shared/services/feeTemplate/fee-template.service';
import { currancyCodes } from './../../shared/currancyCodes';
import { OrganizationService } from '../../shared/services/organization/organization.service';
import { finalize, Observable, pipe } from 'rxjs';
import { OrganizationTariffService } from '../../shared/services/organizationTariff/organization-tariff.service';
import { payVariants } from '../../shared/payVariants';
import { ApartamentUserService } from '../apartament-user.service';

@Component({
  selector: 'app-apartament-user-create',
  templateUrl: './apartament-user-create.component.html',
  styleUrls: ['./apartament-user-create.component.scss']
})
export class ApartamentUserCreateComponent implements OnInit {
  userFind_email: FormControl = new FormControl('test@gmail.com', [Validators.required])
  userFind_loading: boolean = false
  userFind_visible: boolean = true
  userFind_inited: boolean = false
  userFind_status: boolean = false

  foundUser_id: number | null = null
  foundUser_name: string = ''

  selectApartament_tableLoading: boolean = false
  selectApartament_tableItemg$: Observable<any>
  selectedApartament: any = null

  route_apartament_id: number | null

  constructor(
    private http: HttpClient,
    private ActivatedRoute: ActivatedRoute,
    private Location: Location,
    private MessageServ: MessageService,
    private FeeTemplateServ: FeeTemplateService,
    private OrganizationServ: OrganizationService,
    private OrganizationTariffServ: OrganizationTariffService,
    private ApartamentServ: ApartamentService,
    private ApartamentUserServ: ApartamentUserService
  ) {
    this.selectApartament_tableItemg$ = this.ApartamentServ.apartaments$
    this.route_apartament_id = Number(this.ActivatedRoute.snapshot.paramMap.get('apartament_id')) || null
  }

  ngOnInit(): void {
    this.getApartaments()
  }

  findUserByEmail() {
    this.userFind_loading = true
    this.http.get(`apartamentUser/findUserByEmail/${this.userFind_email.value}`)
    .pipe(finalize(() => {
      this.userFind_loading = false
      this.userFind_inited = true
    }))
    .subscribe({
      next: (res: any) => {
        this.userFind_status = true
        if (res?.id){
          this.userFind_visible = false
          this.foundUser_id = res.id
          this.foundUser_name = res.name
          this.MessageServ.sendMessage('success', '', 'Пользователь найден')
        }
      },
      error: (err: any) => {
        this.foundUser_id = null
        this.foundUser_name = ''
        this.userFind_status = false
        this.MessageServ.sendMessage('error', '', 'Пользователь не найден')
      }
    }
    )
  }

  getApartaments() {
    this.selectApartament_tableLoading = true
    this.ApartamentServ.getApartaments()
    .pipe(
      finalize(() => this.selectApartament_tableLoading = false),
      )
    .subscribe({
      next: (res: any) => {
        if (this.route_apartament_id) {
          this.selectedApartament = res.find((el: any) => el.id === this.route_apartament_id)
        }
        this.MessageServ.sendMessage('success', '', 'Квартиры загружены')
      },
      error: (err: any) => {
        this.MessageServ.sendMessage('error', 'Ошибка!', err.error.message)
      }
    })
  }

  selectApartament(item: any) {
    this.selectedApartament = item
  }

  createApartamentUser() {
    this.userFind_loading = true
    this.selectApartament_tableLoading = true
    const data = {
      apartament_id: this.selectedApartament.id,
      user_id: this.foundUser_id
    }
    this.ApartamentUserServ.createApartamentUser(data)
    .pipe(finalize(() => {
      this.userFind_loading = false
      this.selectApartament_tableLoading = false
    }))
    .subscribe({
      next: (res: any) => {
        this.MessageServ.sendMessage('success', '', 'Пользователь добавлен')
      },
      error: (err: any) => {
        this.MessageServ.sendMessage('error', 'Ошибка', err.error.message)
      }
    })
  }

  back() {
    this.Location.back()
  }

}
