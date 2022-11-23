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
  selector: 'app-fee-template-update',
  templateUrl: './fee-template-update.component.html',
  styleUrls: ['./fee-template-update.component.scss']
})
export class FeeTemplateUpdateComponent implements OnInit {
  feeTemplate_id: number = 0
  loading: boolean = false
  apartament_id: FormControl = new FormControl(null, [Validators.required])
  name: FormControl = new FormControl(null, [Validators.required])
  description: FormControl = new FormControl(null)
  sum: FormControl = new FormControl(null)
  currancy: FormControl = new FormControl(null)
  organization_id: FormControl = new FormControl(null)
  payVariant: FormControl = new FormControl(null)
  organizationTariff_id: FormControl = new FormControl(null)


  formGroup: FormGroup = new FormGroup({
    apartament_id: this.apartament_id,
    name: this.name,
    description: this.description,
    sum: this.sum,
    currancy: this.currancy,
    organization_id: this.organization_id,
    payVariant: this.payVariant,
    organizationTariff_id: this.organizationTariff_id
  })

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
    try {
      const feeTemplate_id = Number(this.ActivatedRoute.snapshot.paramMap.get('feeTemplate_id'))
      if (feeTemplate_id) {
        this.feeTemplate_id = feeTemplate_id
        this.getFeeTemplate(feeTemplate_id)
      }
    } catch(error) {
      this.MessageServ.sendMessage('error', 'Ошибка!', (error as any))
      this.Location.back()
    }
    this.organizationOptions$ = this.OrganizationServ.organizations$
    this.organizationTariffOptions$ = this.OrganizationTariffServ.organizationTariffs$
    this.apartamentOptions$ = this.ApartamentServ.apartaments$
  }

  ngOnInit(): void {
    this.currancyOptions = this.getCurrancyOptions()
    this.OrganizationServ.getOrganizations().subscribe()
    this.OrganizationTariffServ.getOrganizationTariffs().subscribe()
    this.ApartamentServ.getApartaments().subscribe()
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
        organization_id: formGroupValue.organization_id,
        organizationTariff_id: formGroupValue.organizationTariff_id,
        payVariant: formGroupValue.payVariant
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

  back() {
    this.Location.back()
  }

  private getCurrancyOptions () {
    if (Array.isArray(currancyCodes)) {
      return currancyCodes.map((el: any) => {
        return { name: el.shortName + ' ' + el.name, value: el.code }
      })
    }
    return []
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
}
