import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common'
import { MessageService } from '../../shared/services/message/message.service';
import { currancyCodes } from './../../shared/currancyCodes';
import { payVariants } from './../../shared/payVariants';
import { MdbModalConfig, MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';

import { Observable, take, tap } from 'rxjs';
import { OrganizationService } from '../../shared/services/organization/organization.service';
import { FeeTemplateService } from '../../shared/services/feeTemplate/fee-template.service';
import { ApartamentService } from '../../shared/services/apartament/apartament.service';
import { OrganizationTariffService } from '../../shared/services/organizationTariff/organization-tariff.service';
import { prependZero } from '../../shared/helpers';
import { MoneyTransferService } from '../money-transfer.service';

@Component({
  selector: 'app-money-transfer-create',
  templateUrl: './money-transfer-create.component.html',
  styleUrls: ['./money-transfer-create.component.scss']
})
export class MoneyTransferCreateComponent implements OnInit {
  loading: boolean = false

  name: FormControl = new FormControl(null)
  description: FormControl = new FormControl(null)

  currancy1: FormControl = new FormControl(643)
  sum1: FormControl = new FormControl(null)
  currancy2: FormControl = new FormControl(null)
  sum2: FormControl = new FormControl(null)
  currancy3: FormControl = new FormControl(null)
  sum3: FormControl = new FormControl(null)
  currancy4: FormControl = new FormControl(null)
  sum4: FormControl = new FormControl(null)
  date: FormControl = new FormControl(new Date().toISOString().slice(0, -14))
  apartament_id: FormControl = new FormControl(3)

  currancyOptions: any[] = []
  apartamentOptions$: Observable<any[]>

  formGroup: FormGroup = new FormGroup({
    name: this.name,
    description: this.description,
    currancy1: this.currancy1,
    sum1: this.sum1,
    currancy2: this.currancy2,
    sum2: this.sum2,
    currancy3: this.currancy3,
    sum3: this.sum3,
    currancy4: this.currancy4,
    sum4: this.sum4,
    date: this.date,
    apartament_id: this.apartament_id
  })
  constructor(
    private ApartamentServ: ApartamentService,
    private MoneyTransferServ: MoneyTransferService,
    private MessageServ: MessageService,
    private Location: Location
  ) {
    this.apartamentOptions$ = this.ApartamentServ.apartaments$
    this.ApartamentServ.getApartaments().subscribe()

  }

  ngOnInit(): void {
    this.currancyOptions = this.getCurrancyOptions()

  }

  back(){
    this.Location.back()
  }

  private getCurrancyOptions () {
    if (Array.isArray(currancyCodes)) {
      return currancyCodes.slice(0, 4).map((el: any) => {
        return { name: el.sign || el.shortName, id: el.code }
      })
    }
    return []
  }

  create() {
    this.loading = true
    const formGroupValue = this.formGroup.value
    let data = {
      name: formGroupValue.name,
      description: formGroupValue.description,

      sum1: formGroupValue.sum1,
      currancy1: formGroupValue.currancy1,
      sum2: formGroupValue.sum2,
      currancy2: formGroupValue.currancy2,
      sum3: formGroupValue.sum3,
      currancy3: formGroupValue.currancy3,
      sum4: formGroupValue.sum4,
      currancy4: formGroupValue.currancy4,

      date: formGroupValue.date,
      apartament_id: formGroupValue.apartament_id,
    }
    this.MoneyTransferServ.create(data).subscribe({
      next: (res: any) => {
        this.MessageServ.sendMessage('success', 'Успешно сохранено!', 'Перевод добавлен')
        this.loading = false
        this.back()
      },
      error: (err: any) => {
        console.log(err)
        this.loading = false
        this.MessageServ.sendMessage('error', 'Ошибка!', err.error.message)
      }
    })
  }
}
