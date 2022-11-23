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
import { ModalCreateFeeTemplateComponent } from '../apartament-fee-create/modal-create-fee-template/modal-create-fee-template.component'
import { Observable } from 'rxjs';
import { OrganizationService } from '../../shared/services/organization/organization.service';
import { FeeTemplateService } from '../../shared/services/feeTemplate/fee-template.service';
import { ApartamentService } from '../../shared/services/apartament/apartament.service';
import { OrganizationTariffService } from '../../shared/services/organizationTariff/organization-tariff.service';


@Component({
  selector: 'app-apartament-fee-update',
  templateUrl: './apartament-fee-update.component.html',
  styleUrls: ['./apartament-fee-update.component.scss']
})
export class ApartamentFeeUpdateComponent implements OnInit {
  @ViewChild ('popoverTrigger') popoverTrigger: ElementRef | undefined
  modalRef: MdbModalRef<ModalCreateFeeTemplateComponent> | null = null;

  openModal(data: any) {
    const config = {
      data: { modalInputdata: data}
    }
    this.modalRef = this.modalService.open(ModalCreateFeeTemplateComponent, config)
  }

  loading: boolean = false
  apartamentFee_id: number = 0

  name: FormControl = new FormControl(null, [Validators.required])
  description: FormControl = new FormControl(null)
  sum: FormControl = new FormControl(null)
  commission: FormControl = new FormControl(null)
  currancy: FormControl = new FormControl(null)
  month: FormControl = new FormControl(null)
  year: FormControl = new FormControl(null)
  paid: FormControl = new FormControl(null)
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
  payVariantOptions: any[] = payVariants
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
      const apartamentFee_id = Number(this.ActivatedRoute.snapshot.paramMap.get('apartamentFee_id'))
      if (apartamentFee_id) {
        this.apartamentFee_id = apartamentFee_id
        this.getApartamentFee(apartamentFee_id)
        this.OrganizationServ.getOrganizations().subscribe()
        this.OrganizationTariffServ.getOrganizationTariffs().subscribe()
        this.FeeTemplateServ.getFeeTemplates().subscribe()
        this.ApartamentServ.getApartaments().subscribe()
      }
    } catch (error) {
      this.Location.back()
    }
    this.organizationOptions$ = this.OrganizationServ.organizations$
    this.organizationTariffOptions$ = this.OrganizationTariffServ.organizationTariffs$
    this.templateOptions$ = this.FeeTemplateServ.feeTemplates$
    this.apartamentOptions$ = this.ApartamentServ.apartaments$
    this.formGroup.get('template_id')?.valueChanges.subscribe((res: any) => {
      if (res !== null) {
        this.popoverTrigger?.nativeElement.click()
      }
    })
  }
  get isPaid () {
    return this.formGroup.get('paid')?.value
  }

  ngOnInit(): void {
    this.yearOptions = this.getYearOptions()
    this.currancyOptions = this.getCurrancyOptions()
  }

  getApartamentFee (id: number) {
    this.loading = true
    this.ApartamentFeeServ.getFee(id).subscribe({
      next: (res: any) => {
        this.formGroup.patchValue({
          name: res.name,
          description: res.description,
          sum: res.sum,
          commission: res.commission,
          currancy: res.currancy,
          month: res.month,
          year: res.year,
          paid: Boolean(res.paid),
          organization_id: res.organization_id,
          template_id: res.template_id,
          apartament_id: res.apartament_id,
          organizationTariff_id: res.organizationTariff_id,
          paidDate: res.paidDate,
          payVariant: res.payVariant
        })
        this.loading = false
      },
      error: (err: any) => {
        this.MessageServ.sendMessage('error', 'Ошибка!', err.error.message)
        this.loading = false
      }
    })
  }

  closeTemplateConfirm (confirm: boolean) {
    if (confirm) {
      this.popoverTrigger?.nativeElement.click()
      this.templateOptions$.subscribe(res => {
        if (res && Array.isArray(res)){
          const newForm = res.find((el: any) => +this.formGroup.get('template_id')?.value === +el.id)
          if (newForm) {
            this.formGroup.patchValue({
              name: newForm.name,
              // description: newForm.description,
              sum: newForm.sum,
              currancy: newForm.currancy,
              organization_id: newForm.organization_id,
              apartament_id: newForm.apartament_id,
              organizationTariff_id: newForm.organizationTariff_id,
              payVariant: newForm.payVariant
            })
          }
        }
      })
    } else {
      this.formGroup.get('template_id')?.patchValue(null)
      this.popoverTrigger?.nativeElement.click()
    }

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

  update() {
    this.loading = true
    const formGroupValue = this.formGroup.value
    let data = {
      id: this.apartamentFee_id,
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
    // console.log(data)
    this.ApartamentFeeServ.update(data).subscribe({
      next: (res: any) => {
        this.MessageServ.sendMessage('success', 'Успешно сохранено!', 'Счет добавлен')
        if (!res.template_id) {
          this.openModal(res)
        }
        this.loading = false
        this.Location.back()
      },
      error: (err: any) => {
        this.loading = false
        this.MessageServ.sendMessage('error', 'Ошибка!', err.error.message)
      }
    })
  }

  delete() {
    this.ApartamentFeeServ.delete(this.apartamentFee_id).subscribe({
      next: (res: any) => {
        this.MessageServ.sendMessage('success', 'Успешно сохранено!', 'Счет добавлен')
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

}
