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

  loading: boolean = false
  apartament_id: FormControl = new FormControl(null, [Validators.required])
  name: FormControl = new FormControl(null, [Validators.required])
  description: FormControl = new FormControl(null)
  sum: FormControl = new FormControl(null)
  currancy: FormControl = new FormControl(null)
  month: FormControl = new FormControl(null)
  year: FormControl = new FormControl(null)
  organization_id: FormControl = new FormControl(null)
  payVariant: FormControl = new FormControl(null)
  organizationTariff_id: FormControl = new FormControl(null)

  formGroup: FormGroup = new FormGroup({
    apartament_id: this.apartament_id,
    name: this.name,
    description: this.description,
    sum: this.sum,
    currancy: this.currancy,
    month: this.month,
    year: this.year,
    organization_id: this.organization_id,
    payVariant: this.payVariant,
    organizationTariff_id: this.organizationTariff_id
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
    this.organizationOptions$ = this.OrganizationServ.organizations$
    this.organizationTariffOptions$ = this.OrganizationTariffServ.organizationTariffs$
    this.apartamentOptions$ = this.ApartamentServ.apartaments$
  }

  ngOnInit(): void {
    this.yearOptions = this.getYearOptions()

    this.currancyOptions = this.getCurrancyOptions()
    this.OrganizationServ.getOrganizations().subscribe()
    this.OrganizationTariffServ.getOrganizationTariffs().subscribe()
    this.ApartamentServ.getApartaments().subscribe()
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
      month: Number(formGroupValue.month),
      year: formGroupValue.year,
      organization_id: formGroupValue.organization_id,
      organizationTariff_id: formGroupValue.organizationTariff_id,
      payVariant: formGroupValue.payVariant
    }
    // console.log(data)
    this.FeeTemplateServ.create(data).subscribe({
      next: (res: any) => {
        this.MessageServ.sendMessage('success', '?????????????? ??????????????????!', '???????????? ????????????????')
        this.Location.back()
      },
      error: (err: any) => {
        this.loading = false
        this.MessageServ.sendMessage('error', '????????????!', err.error.message)
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
      return currancyCodes.map((el: any) => {
        return { name: el.shortName + ' ' + el.name, value: el.code }
      })
    }
    return []
  }

}
