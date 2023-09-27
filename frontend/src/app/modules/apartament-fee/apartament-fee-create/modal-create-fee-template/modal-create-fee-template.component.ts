import { ApartamentService } from './../../../shared/services/apartament/apartament.service';
import { Component, Inject, OnInit } from '@angular/core';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { currancyCodes } from 'src/app/modules/shared/currancyCodes';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common'
import { MessageService } from '../../../shared/services/message/message.service';
import { FeeTemplateService } from '../../../shared/services/feeTemplate/fee-template.service';
import { HttpClient } from '@angular/common/http';

import { OrganizationService } from '../../../shared/services/organization/organization.service';
import { Observable } from 'rxjs';
import { OrganizationTariffService } from '../../../shared/services/organizationTariff/organization-tariff.service';
import { ApartamentFeeService } from '../../../shared/services/apartamentFee/apartament-fee.service';
import { payVariants } from 'src/app/modules/shared/payVariants';


@Component({
  selector: 'app-modal-create-fee-template',
  templateUrl: './modal-create-fee-template.component.html',
  styleUrls: ['./modal-create-fee-template.component.scss']
})
export class ModalCreateFeeTemplateComponent implements OnInit {
  loading: boolean = false

  formGroup: UntypedFormGroup = new UntypedFormGroup({
    name: new UntypedFormControl(null, [Validators.required]),
    description: new UntypedFormControl(null),
    sum: new UntypedFormControl(null),
    currancy: new UntypedFormControl(null),
    apartament_id: new UntypedFormControl(null),
  })

  currancyOptions: any[] = []
  payVariantOptions: any[] = []

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
      this.apartamentOptions$ = this.ApartamentServ.apartaments$
    }


  ngOnInit(): void {
    this.currancyOptions = this.getCurrancyOptions()
    this.ApartamentServ.getApartaments().subscribe()
    this.formGroup.patchValue({
      name: this.modalInputdata.name,
      description: this.modalInputdata.description,
      sum: this.modalInputdata.sum,
      currancy: this.modalInputdata.currancy,
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
    }
    this.FeeTemplateServ.create(data).subscribe({
      next: (res: any) => {
        this.MessageServ.sendMessage('success', 'Успешно сохранено!', 'Шаблон добавлен')
        this.Location.back()
        this.modalRef.close()
      },
      error: (err: any) => {
        this.loading = false
        this.MessageServ.sendMessage('error', 'Ошибка!', err.error.message)
      }
    })
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
  getControl(formGroup: UntypedFormGroup, formControlId: string): UntypedFormControl {
    let formControl: UntypedFormControl = new UntypedFormControl(null)
    formControl = (formGroup.get(formControlId) as UntypedFormControl) || new UntypedFormControl(null)
    return formControl
  }
}
