import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common'
import { MessageService } from '../../shared/services/message/message.service';
import { ApartamentFeeService } from '../apartament-fee.service';
import { currancyCodes } from './../../shared/currancyCodes';
import { payVariants } from './../../shared/payVariants';
import { MdbModalConfig, MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { ModalCreateFeeTemplateComponent } from './modal-create-fee-template/modal-create-fee-template.component'
import { Observable, take, tap } from 'rxjs';
import { OrganizationService } from '../../shared/services/organization/organization.service';
import { FeeTemplateService } from '../../shared/services/feeTemplate/fee-template.service';
import { ApartamentService } from '../../shared/services/apartament/apartament.service';
import { OrganizationTariffService } from '../../shared/services/organizationTariff/organization-tariff.service';
import { prependZero } from '../../shared/helpers';

@Component({
  selector: 'app-apartament-fee-create',
  templateUrl: './apartament-fee-create.component.html',
  styleUrls: ['./apartament-fee-create.component.scss']
})
export class ApartamentFeeCreateComponent implements OnInit {

  @ViewChild ('popoverTrigger') popoverTrigger: ElementRef | undefined
  modalRef: MdbModalRef<ModalCreateFeeTemplateComponent> | null = null;
  // showBasic: boolean = false
  openModal(data: any) {
    const config = {
      data: { modalInputdata: data}
    }
    this.modalRef = this.modalService.open(ModalCreateFeeTemplateComponent, config)
  }

  loading: boolean = false

  name: FormControl = new FormControl(null, [Validators.required])
  description: FormControl = new FormControl(null)
  sum: FormControl = new FormControl(null)
  commission: FormControl = new FormControl(null)
  currancy: FormControl = new FormControl(null)
  month: FormControl = new FormControl(null)
  year: FormControl = new FormControl(null)
  paid: FormControl = new FormControl(true)
  paidDate: FormControl = new FormControl(new Date().toISOString().slice(0, -14))
  payVariant: FormControl = new FormControl(null)
  organization_id: FormControl = new FormControl(null)
  organizationTariff_id: FormControl = new FormControl(null)
  apartament_id: FormControl = new FormControl(null, [Validators.required])
  template_id: FormControl = new FormControl(null)

  formGroup: FormGroup = new FormGroup({
    apartament_id: this.apartament_id,
    name: this.name,
    description: this.description,
    sum: this.sum,
    commission: this.commission,
    currancy: this.currancy,
    month: this.month,
    year: this.year,
    paid: this.paid,
    paidDate: this.paidDate,
    payVariant: this.payVariant,
    organization_id: this.organization_id,
    organizationTariff_id: this.organizationTariff_id,
    template_id: this.template_id
  })
  yearOptions: any[] = []
  currancyOptions: any[] = []
  payVariantOptions: any[] = []
  organizationOptions$: Observable<any[]>
  organizationTariffOptions$: Observable<any[]>
  templateOptions$: Observable<any[]>
  apartamentOptions$: Observable<any[]>

  constructor(
    private modalService: MdbModalService,
    private http: HttpClient,
    private ActivatedRoute: ActivatedRoute,
    private Location: Location,
    private MessageServ: MessageService,
    private ApartamentServ: ApartamentService,
    private ApartamentFeeServ: ApartamentFeeService,
    private OrganizationServ: OrganizationService,
    private OrganizationTariffServ: OrganizationTariffService,
    private FeeTemplateServ: FeeTemplateService
  ) {

    try {
      const apartament_id = this.ActivatedRoute.snapshot.paramMap.get('apartament_id')
      this.formGroup.patchValue({
        apartament_id: apartament_id
      })

    } catch (error) {
      // this.Location.back()
    }
    this.OrganizationServ.getOrganizations().subscribe()
    this.OrganizationTariffServ.getOrganizationTariffs().subscribe()
    this.FeeTemplateServ.getFeeTemplates().subscribe()
    this.ApartamentServ.getApartaments().subscribe()
    this.organizationOptions$ = this.OrganizationServ.organizations$
    this.organizationTariffOptions$ = this.OrganizationTariffServ.organizationTariffs$

    this.templateOptions$ = this.FeeTemplateServ.feeTemplates$
    this.apartamentOptions$ = this.ApartamentServ.apartaments$
    this.formGroup.get('template_id')?.valueChanges.subscribe((res: any) => {
      if (res !== null) {
        const foundDirty = Object.keys(this.formGroup.controls).find((name: any) => {
          return name !== 'template_id' && this.formGroup.get(name)?.dirty
        })
        if (foundDirty) {
          this.popoverTrigger?.nativeElement.click()
        } else {
          this.assignTemplate()
        }
      }
    })
    this.formGroup.get('month')?.valueChanges.subscribe((res: any) => {
      const paidDate = this.formGroup.get('paidDate')?.value
      if (paidDate) {
        const newPaidDate = new Date(new Date(paidDate).setMonth(Number(res))).toISOString().slice(0, -14)
        this.formGroup.patchValue({
          paidDate: newPaidDate
        })
      }
    })
    this.formGroup.get('year')?.valueChanges.subscribe((res: any) => {
      const paidDate = this.formGroup.get('paidDate')?.value
      if (paidDate) {
        const newPaidDate = new Date(new Date(paidDate).setFullYear(Number(res))).toISOString().slice(0, -14)
        this.formGroup.patchValue({
          paidDate: newPaidDate
        })
      }
    })
  }
  get isPaid () {
    return this.formGroup.get('paid')?.value
  }

  ngOnInit(): void {
    this.yearOptions = this.getYearOptions()
    this.currancyOptions = this.getCurrancyOptions()
    this.payVariantOptions = payVariants
  }

  closeTemplateConfirm (confirm: boolean) {
    if (confirm) {
      this.popoverTrigger?.nativeElement.click()
      this.assignTemplate()
    } else {
      this.formGroup.get('template_id')?.patchValue(null)
      this.popoverTrigger?.nativeElement.click()
    }
  }

  private assignTemplate() {
    this.templateOptions$.pipe(take(1)).subscribe(res => {
      if (res && Array.isArray(res)){
        const newForm = res.find((el: any) => +this.formGroup.get('template_id')?.value === +el.id)
        if (newForm) {
          this.formGroup.patchValue({
            name: newForm.name,
            sum: newForm.sum,
            currancy: newForm.currancy,
            month: newForm.month,
            year: newForm.year,
            organization_id: newForm.organization_id,
            apartament_id: newForm.apartament_id,
            organizationTariff_id: newForm.organizationTariff_id,
            payVariant: newForm.payVariant
          })
        }
      }
    })
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
        return { name: el.shortName + ' ' + el.name, id: el.code }
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
      sum: formGroupValue.sum,
      commission: formGroupValue.commission,
      currancy: formGroupValue.currancy,
      month: Number(formGroupValue.month),
      year: formGroupValue.year,
      paid: Boolean(formGroupValue.paid),
      organization_id: formGroupValue.organization_id,
      template_id: formGroupValue.template_id,
      apartament_id: formGroupValue.apartament_id,
      organizationTariff_id: formGroupValue.organizationTariff_id,
      paidDate: this.isPaid ? formGroupValue.paidDate : '',
      payVariant: formGroupValue.payVariant,
    }
    this.ApartamentFeeServ.create(data).subscribe({
      next: (res: any) => {
        this.MessageServ.sendMessage('success', 'Успешно сохранено!', 'Счет добавлен')
        this.loading = false

        if (!res.template_id) {
          this.openModal(res)
        } else {
          this.Location.back()
        }
      },
      error: (err: any) => {
        console.log(err)
        this.loading = false
        this.MessageServ.sendMessage('error', 'Ошибка!', err.error.message)
      }
    })
  }

  back() {
    this.Location.back()
  }

}
