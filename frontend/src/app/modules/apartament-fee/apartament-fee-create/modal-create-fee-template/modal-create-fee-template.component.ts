import { ApartamentService } from './../../../shared/services/apartament/apartament.service';
import { Component, Inject, OnInit } from '@angular/core';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { currancyCodes } from 'src/app/modules/shared/currancyCodes';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common'
import { MessageService } from '../../../shared/services/message/message.service';
import { FeeTemplateService } from '../../../shared/services/feeTemplate/fee-template.service';
import { HttpClient } from '@angular/common/http';

import { OrganizationService } from '../../../shared/services/organization/organization.service';
import { Observable } from 'rxjs';
import { OrganizationTariffService } from '../../../shared/services/organizationTariff/organization-tariff.service';
import { ApartamentFeeService } from '../../apartament-fee.service';


@Component({
  selector: 'app-modal-create-fee-template',
  templateUrl: './modal-create-fee-template.component.html',
  styleUrls: ['./modal-create-fee-template.component.scss']
})
export class ModalCreateFeeTemplateComponent implements OnInit {
  loading: boolean = false

  name: FormControl = new FormControl(null, [Validators.required])
  description: FormControl = new FormControl(null)
  sum: FormControl = new FormControl(null)
  currancy: FormControl = new FormControl(null)
  payVariant: FormControl = new FormControl(null)
  organization_id: FormControl = new FormControl(null)
  organizationTariff_id: FormControl = new FormControl(null)
  apartament_id: FormControl = new FormControl(null)

  formGroup: FormGroup = new FormGroup({
    name: this.name,
    description: this.description,
    sum: this.sum,
    currancy: this.currancy,
    payVariant: this.payVariant,
    organization_id: this.organization_id,
    organizationTariff_id: this.organizationTariff_id,
    apartament_id: this.apartament_id,
  })

  currancyOptions: any[] = []
  organizationOptions$: Observable<any[]>
  organizationTariffOptions$: Observable<any[]>
  apartamentOptions$: Observable<any[]>
  modalInputdata: any = null
  constructor(
    public modalRef: MdbModalRef<ModalCreateFeeTemplateComponent>,

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
    this.currancyOptions = this.getCurrancyOptions()
    this.OrganizationServ.getOrganizations().subscribe()
    this.OrganizationTariffServ.getOrganizationTariffs().subscribe()
    this.ApartamentServ.getApartaments().subscribe()
    // console.log(this.modalInputdata)
    this.formGroup.patchValue({
      name: this.modalInputdata.name,
      description: this.modalInputdata.description,
      sum: this.modalInputdata.sum,
      currancy: this.modalInputdata.currancy,
      payVariant: this.modalInputdata.payVariant,
      organization_id: this.modalInputdata.organization_id,
      organizationTariff_id: this.modalInputdata.organizationTariff_id,
      apartament_id: this.modalInputdata.apartament_id
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
        organization_id: formGroupValue.organization_id,
        organizationTariff_id: formGroupValue.organizationTariff_id,
        payVariant: formGroupValue.payVariant
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


  private getCurrancyOptions () {
    if (Array.isArray(currancyCodes)) {
      return currancyCodes.map((el: any) => {
        return { name: el.shortName + ' ' + el.name, value: el.code }
      })
    }
    return []
  }
}
