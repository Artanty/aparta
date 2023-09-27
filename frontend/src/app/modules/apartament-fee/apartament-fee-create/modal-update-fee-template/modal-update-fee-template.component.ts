import { ApartamentService } from './../../../shared/services/apartament/apartament.service';
import { Component, OnInit } from '@angular/core';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { currancyCodes } from 'src/app/modules/shared/currancyCodes';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common'
import { MessageService } from '../../../shared/services/message/message.service';
import { FeeTemplateService } from '../../../shared/services/feeTemplate/fee-template.service';
import { HttpClient } from '@angular/common/http';

import { OrganizationService } from '../../../shared/services/organization/organization.service';
import { Observable, tap } from 'rxjs';
import { OrganizationTariffService } from '../../../shared/services/organizationTariff/organization-tariff.service';
import { GetFeesApiResponseItem } from 'src/app/modules/shared/services/apartamentFee/types';
import { FeeTemplateApiResponseItem, FeeTemplateUpdateApiRequest } from 'src/app/modules/shared/services/feeTemplate/types';


@Component({
  selector: 'app-modal-update-fee-template',
  templateUrl: './modal-update-fee-template.component.html',
  styleUrls: ['./modal-update-fee-template.component.scss']
})


export class ModalUpdateFeeTemplateComponent implements OnInit {
  loading: boolean = false
  FormControl = UntypedFormControl
  formGroup: UntypedFormGroup = new UntypedFormGroup({
    name: new UntypedFormControl(null, [Validators.required]),
    description: new UntypedFormControl(null),
    sum: new UntypedFormControl(null),
    currancy: new UntypedFormControl(null),
    apartament_id: new UntypedFormControl(null),
    id: new UntypedFormControl(null),
    paidDate: new UntypedFormControl(null)
  })
  templateFormGroup: UntypedFormGroup = new UntypedFormGroup({
    name: new UntypedFormControl(null, [Validators.required]),
    description: new UntypedFormControl(null),
    sum: new UntypedFormControl({ value: null, disabled: true }),
    currancy: new UntypedFormControl(null),
    apartament_id: new UntypedFormControl(null),
    apartament_name: new UntypedFormControl(null),
    paidDate: new UntypedFormControl(null)
  })
  ev (ev: any) {
    ev.preventDefault()
  }
  currancyOptions: any[] = []
  payVariantOptions: any[] = []

  apartamentOptions$: Observable<any[]>
  fee: GetFeesApiResponseItem | null = null
  template: FeeTemplateApiResponseItem | null = null
  constructor(
    public modalRef: MdbModalRef<ModalUpdateFeeTemplateComponent>,

    private http: HttpClient,
    private ActivatedRoute: ActivatedRoute,
    private Location: Location,
    private MessageServ: MessageService,
    private FeeTemplateServ: FeeTemplateService,
    private OrganizationServ: OrganizationService,
    private OrganizationTariffServ: OrganizationTariffService,
    private ApartamentServ: ApartamentService
    ) {
      this.apartamentOptions$ = this.ApartamentServ.apartaments$.pipe(
        tap((res: any) => {
          const value = this.templateFormGroup.get('apartament_id')?.value
          if (value) {
            const found = res.find((el: any) => el.id === value)
            if (found) {
              this.templateFormGroup.get('apartament_name')?.setValue(found.name)
            }
          }
        })
      )
    }


  ngOnInit(): void {
    this.currancyOptions = this.getCurrancyOptions()
    this.ApartamentServ.getApartaments().subscribe()

    if (this.fee) {
      this.formGroup.patchValue({
        id: Number(this.fee.template_id),
        name: this.fee.name,
        description: this.fee.description,
        sum: this.fee.sum,
        currancy: this.fee.currancy,
        apartament_id: this.fee.apartament_id,
        paidDate: this.fee.paidDate
      })
    }
    if (this.template) {
      this.templateFormGroup.patchValue({
        name: this.template.name,
        description: this.template.description,
        sum: this.template.sum,
        currancy: this.template.currancy,
        apartament_id: this.template.apartament_id,
        paidDate: this.template.paidDate
      })
    }
  }

  update() {
    this.loading = true
    const formGroupValue = this.formGroup.value
    let data: FeeTemplateUpdateApiRequest = {
      id: Number(formGroupValue.id),
      name: formGroupValue.name,
      apartament_id: formGroupValue.apartament_id,
      description: formGroupValue.description,
      sum: formGroupValue.sum,
      currancy: formGroupValue.currancy,
      paidDate: formGroupValue.paidDate,
    }
    this.FeeTemplateServ.update(data).subscribe({
      next: (res: FeeTemplateApiResponseItem) => {
        this.MessageServ.sendMessage('success', 'Успешно сохранено!', 'Шаблон обновлен')
        // this.Location.back()
        this.modalRef.close(this.formGroup.value)
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

  resetControl(formControlId: string | string[]) {
    let controls: string[] = []
    if (typeof formControlId === 'string') {
      controls.push(formControlId)
    } else {
      controls = formControlId
    }
    controls.forEach((control: string) => {
      const toChange = this.getControl(this.formGroup, control)
      const value = this.getControl(this.templateFormGroup, control)?.value
      toChange.setValue(value)
    })
  }
}
