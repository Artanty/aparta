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
import { Observable } from 'rxjs';
import { OrganizationTariffService } from '../../shared/services/organizationTariff/organization-tariff.service';
import { payVariants } from '../../shared/payVariants';

@Component({
  selector: 'app-fee-template-create',
  templateUrl: './fee-template-create.component.html',
  styleUrls: ['./fee-template-create.component.scss']
})
export class FeeTemplateCreateComponent implements OnInit {
  feeTemplate_id: number = 0
  loading: boolean = false

  formGroup: FormGroup = new FormGroup({
    name: new FormControl(null, [Validators.required]),
    sum: new FormControl(null),
    currancy: new FormControl(null),
    apartament_id: new FormControl(null, [Validators.required]),
    month: new FormControl(null),
    year: new FormControl(null),
    description: new FormControl(null)
  })
  yearOptions: any[] = []
  currancyOptions: any[] = []
  payVariantOptions: any[] = payVariants
  organizationOptions$: Observable<any[]>
  organizationTariffOptions$: Observable<any[]>
  apartamentOptions$: Observable<any[]>

  constructor(
    private http: HttpClient,
    private ActivatedRoute: ActivatedRoute,
    private Location: Location,
    private MessageServ: MessageService,
    private FeeTemplateServ: FeeTemplateService,
    private OrganizationServ: OrganizationService,
    private OrganizationTariffServ: OrganizationTariffService,
    private ApartamentServ: ApartamentService
  ) {
    const feeTemplate_id = Number(this.ActivatedRoute.snapshot.paramMap.get('feeTemplate_id'))
      if (feeTemplate_id) {
        this.feeTemplate_id = feeTemplate_id
        this.getFeeTemplate(feeTemplate_id)
      }
    this.organizationOptions$ = this.OrganizationServ.organizations$
    this.organizationTariffOptions$ = this.OrganizationTariffServ.organizationTariffs$
    this.apartamentOptions$ = this.ApartamentServ.apartaments$
    this.formGroup.controls['currancy'].valueChanges.subscribe((res: any) => this.saveCurrancy(res))
  }

  ngOnInit(): void {
    this.loadCurrancy()
    this.yearOptions = this.getYearOptions()

    this.currancyOptions = this.getCurrancyOptions()
    this.OrganizationServ.getOrganizations().subscribe()
    this.OrganizationTariffServ.getOrganizationTariffs().subscribe()
    this.ApartamentServ.getApartaments(true).subscribe()
  }
  getFeeTemplate(id: number) {
    this.loading = true
    this.FeeTemplateServ.getFeeTemplate(id).subscribe({
      next: (res: any) => {
        this.formGroup.patchValue({
          name: res.name,
          apartament_id: res.apartament_id,
          description: res.description,
          sum: res.sum,
          currancy: res.currancy,
          month: res.month,
          year: res.year,
          organization_id: res.organization_id,
          organizationTariff_id: res.organizationTariff_id,
          payVariant: res.payVariant
        })
        this.loading = false
      },
      error: (err: any) => {
        this.loading = false
        this.MessageServ.sendMessage('error', 'Ошибка!', err.error.message)
      }
    })
  }
  create() {
    this.loading = true
    const formGroupValue = this.formGroup.value
    let data = {
      name: formGroupValue.name,
      apartament_id: formGroupValue.apartament_id,
      description: formGroupValue.description,
      sum: formGroupValue.sum,
      currancy: formGroupValue.currancy,
      paidDate: formGroupValue.paidDate
    }
    // console.log(data)
    this.FeeTemplateServ.create(data).subscribe({
      next: (res: any) => {
        this.MessageServ.sendMessage('success', 'Успешно сохранено!', 'Шаблон добавлен')
        this.Location.back()
      },
      error: (err: any) => {
        this.loading = false
        this.MessageServ.sendMessage('error', 'Ошибка!', err.error.message)
      }
    })
  }

  update() {
    this.loading = true
    const formGroupValue = this.formGroup.value
    let data = {
        id: this.feeTemplate_id,
        name: formGroupValue.name,
        apartament_id: formGroupValue.apartament_id,
        description: formGroupValue.description,
        sum: formGroupValue.sum,
        currancy: formGroupValue.currancy,
        paidDate: formGroupValue.paidDate
    }
    this.FeeTemplateServ.update(data).subscribe({
      next: (res: any) => {
        this.MessageServ.sendMessage('success', 'Успешно сохранено!', 'Шаблон изменен')
        this.Location.back()
      },
      error: (err: any) => {
        this.loading = false
        this.MessageServ.sendMessage('error', 'Ошибка!', err.error.message)
      }
    })
  }

  delete() {
    this.FeeTemplateServ.delete(this.feeTemplate_id).subscribe({
      next: (res: any) => {
        this.MessageServ.sendMessage('success', '', 'Шаблон удален')
        this.Location.back()
        this.loading = false
      },
      error: (err: any) => {
        this.loading = false
        this.MessageServ.sendMessage('error', 'Ошибка!', err.error.message)
      }
    })
  }

  back() {
    this.Location.back()
  }

  private getYearOptions() {
    const nowYear = new Date().getFullYear()
    return [
      { name: nowYear - 4, id: nowYear - 4 },
      { name: nowYear - 3, id: nowYear - 3 },
      { name: nowYear - 2, id: nowYear - 2 },
      { name: nowYear - 1, id: nowYear - 1 },
      { name: nowYear, id: nowYear },
      { name: nowYear + 1, id: nowYear + 1 }
    ]
  }

  private getCurrancyOptions () {
    if (Array.isArray(currancyCodes)) {
      return currancyCodes.slice(0, 4).map((el: {
        shortName: string
        code: number
        name: string
        sign?: string
      }) => {
        return { name: el.sign || el.shortName, id: el.code }
      })
    }
    return []
  }

  private saveCurrancy(data: number) {
    localStorage.setItem('feeTemplate_currancy', String(data))
  }

  private loadCurrancy() {
    const currancy = localStorage.getItem('feeTemplate_currancy')
    if (currancy){
      this.formGroup.patchValue({
        currancy: Number(currancy)
      })
    }
  }

  getControl(formGroup: FormGroup, formControlId: string): FormControl {
    let formControl: FormControl = new FormControl(null)
    formControl = (formGroup.get(formControlId) as FormControl) || new FormControl(null)
    return formControl
  }
}
