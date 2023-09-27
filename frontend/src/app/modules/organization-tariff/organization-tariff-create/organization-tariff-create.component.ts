import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common'
import { MessageService } from '../../shared/services/message/message.service';
import { currancyCodes } from './../../shared/currancyCodes';
import { OrganizationService } from '../../shared/services/organization/organization.service';
import { Observable } from 'rxjs';
import { OrganizationTariffService } from '../../shared/services/organizationTariff/organization-tariff.service';

@Component({
  selector: 'app-organization-tariff-create',
  templateUrl: './organization-tariff-create.component.html',
  styleUrls: ['./organization-tariff-create.component.scss']
})

export class OrganizationTariffCreateComponent implements OnInit {

  loading: boolean = false
  name: UntypedFormControl = new UntypedFormControl(null, [Validators.required])
  description: UntypedFormControl = new UntypedFormControl(null)
  price: UntypedFormControl = new UntypedFormControl(null)
  measure: UntypedFormControl = new UntypedFormControl(null)
  fee_frequency: UntypedFormControl = new UntypedFormControl(null)
  fee_deadline: UntypedFormControl = new UntypedFormControl(null)
  organization_id: UntypedFormControl = new UntypedFormControl('_label')

  formGroup: UntypedFormGroup = new UntypedFormGroup({
    name: this.name,
    description: this.description,
    price: this.price,
    measure: this.measure,
    fee_frequency: this.fee_frequency,
    fee_deadline: this.fee_deadline,
    organization_id: this.organization_id
  })
  organizationOptions: Observable<any[]>

  constructor(
    private http: HttpClient,
    private ActivatedRoute: ActivatedRoute,
    private Location: Location,
    private MessageServ: MessageService,
    private OrganizationServ: OrganizationService,
    private OrganizationTariffServ: OrganizationTariffService

  ) {
    this.organizationOptions = this.OrganizationServ.organizations$
  }

  ngOnInit(): void {
    this.OrganizationServ.getOrganizations().subscribe()
  }

  create() {
    this.loading = true
    const formGroupValue = this.formGroup.value
    let data = {
      name: formGroupValue.name,
      description: formGroupValue.description,
      price: formGroupValue.price,
      measure: formGroupValue.measure,
      fee_frequency: formGroupValue.fee_frequency,
      fee_deadline: formGroupValue.fee_deadline,
      organization_id: formGroupValue.organization_id
    }
    console.log(data)
    this.OrganizationTariffServ.create(data).subscribe({
      next: (res: any) => {
        this.MessageServ.sendMessage('success', 'Успешно сохранено!', 'Организация добавлена')
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

}
