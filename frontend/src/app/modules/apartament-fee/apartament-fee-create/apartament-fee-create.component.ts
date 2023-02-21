import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common'
import { MessageService } from '../../shared/services/message/message.service';
import { ApartamentFeeService } from '../../shared/services/apartamentFee/apartament-fee.service';
import { currancyCodes } from './../../shared/currancyCodes';
import { payVariants } from './../../shared/payVariants';
import { MdbModalConfig, MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { ModalCreateFeeTemplateComponent } from './modal-create-fee-template/modal-create-fee-template.component'
import { EMPTY, map, Observable, of, take, tap, startWith, withLatestFrom, combineLatestWith } from 'rxjs';
import { OrganizationService } from '../../shared/services/organization/organization.service';
import { FeeTemplateService } from '../../shared/services/feeTemplate/fee-template.service';
import { ApartamentService } from '../../shared/services/apartament/apartament.service';
import { OrganizationTariffService } from '../../shared/services/organizationTariff/organization-tariff.service';
import { prependZero } from '../../shared/helpers';
import { FeeTemplateApiResponseItem } from '../../shared/services/feeTemplate/types';
import { ApartamentFeeCreateApiRequest, GetFeesApiResponseItem } from '../../shared/services/apartamentFee/types';
import { ModalUpdateFeeTemplateComponent } from './modal-update-fee-template/modal-update-fee-template.component';
import { GetExchangeRateApiResponse } from '../../exchange-rate/types';
import { LoadMoneyTransferApiResponse } from '../../shared/services/moneyTransfer/money-transfer.service';
export enum EExchangeRateSource {
  MONEY_TRANSFER_LIST = '1',
  EXCHANGE_RATE_LIST = '2'
}
@Component({
  selector: 'app-apartament-fee-create',
  templateUrl: './apartament-fee-create.component.html',
  styleUrls: ['./apartament-fee-create.component.scss']
})
export class ApartamentFeeCreateComponent implements OnInit {
  initialTemplateObj: FeeTemplateApiResponseItem | null = null
  allowUpdateTemplate: null | GetFeesApiResponseItem = null
  apartamentFee_id: number = 0
  payDatePrevMonth: boolean
  @ViewChild ('popoverTrigger') popoverTrigger: ElementRef | undefined
  modalRef: MdbModalRef<ModalCreateFeeTemplateComponent> | null = null
  loading: boolean = false
  formGroup: FormGroup = new FormGroup({
    apartament_id: new FormControl(null, [Validators.required]),
    name: new FormControl(null, [Validators.required]),
    description: new FormControl(null),
    sum: new FormControl(null),
    currancy: new FormControl(null),
    month: new FormControl(null),
    year: new FormControl(null),
    paid: new FormControl(true),
    paidDate: new FormControl(null),
    template_id: new FormControl(null),
    rateSource: new FormControl(null),
    rateId: new FormControl(null)
  })
  yearOptions: any[] = []
  currancyOptions: any[] = []

  templateOptions$: Observable<any[]>
  apartamentOptions$: Observable<any[]>
  EExchangeRateSource = EExchangeRateSource
  formGroup2: FormGroup = new FormGroup({
    radio: new FormControl(EExchangeRateSource.MONEY_TRANSFER_LIST)
  })
  constructor(
    private modalService: MdbModalService,
    private http: HttpClient,
    private ActivatedRoute: ActivatedRoute,
    private Location: Location,
    private MessageServ: MessageService,
    private ApartamentServ: ApartamentService,
    private ApartamentFeeServ: ApartamentFeeService,
    private FeeTemplateServ: FeeTemplateService,
    private Router: Router
  ) {
    this.formGroup2.valueChanges.subscribe((res: any) => {
      console.log(res)
    })
    this.payDatePrevMonth = Boolean(Number(localStorage.getItem('payDatePrevMonth')))

    this.FeeTemplateServ.getFeeTemplates().subscribe()
    this.ApartamentServ.getApartaments().subscribe()

    this.templateOptions$ = this.FeeTemplateServ.feeTemplates$.pipe(
      combineLatestWith(this.formGroup.get('apartament_id')?.valueChanges.pipe(startWith(this.formGroup.get('apartament_id')?.value)) || of(this.formGroup.get('apartament_id')?.value)),
      map((res: [FeeTemplateApiResponseItem[], string]) => {
        const id: number = +res[1]
        const prop = 'apartament_id'
        if (Array.isArray(res[0]) && id) {
          res[0].sort((a, b) => {
            let result = 0
            if (+a[prop] === id && +b[prop] !== id) {
              result = -1
            }
            if (+a[prop] !== id && +b[prop] === id) {
              result = 1
            }
            return result || a.name.localeCompare(b.name)
          })
        }
        return res[0]
      })
    )
    const apartament_id = this.ActivatedRoute.snapshot.paramMap.get('apartament_id')
    if (apartament_id) {
      setTimeout(() => {
        this.formGroup.patchValue({
          apartament_id: apartament_id
        })
      }, 0)
    }

    this.apartamentOptions$ = this.ApartamentServ.apartaments$
    this.formGroup.get('template_id')?.valueChanges.subscribe((res: number | null) => {
      if (res !== null) {
        this.loadFeeTemplate(res)
        const foundDirty = Object.keys(this.formGroup.controls).find((name: any) => {
          return name !== 'template_id' && this.formGroup.get(name)?.dirty
        })
        if (foundDirty) {
          this.popoverTrigger?.nativeElement.click()
        } else {
          this.assignTemplate(false)
        }
      }
    })

    this.formGroup.get('paidDate')?.valueChanges.subscribe((res: any) => {
      if (res) {
        this.setMonthAndYear(res)
      }
    })
    this.formGroup.get('paid')?.valueChanges.subscribe((res: any) => {
      this.setPaidDateDisable()
    })
    const apartamentFee_id = Number(this.ActivatedRoute.snapshot.paramMap.get('apartamentFee_id'))
    if (apartamentFee_id) {
      this.apartamentFee_id = apartamentFee_id
      this.getApartamentFee(apartamentFee_id)
    } else {
      this.formGroup.patchValue({
        paidDate: new Date().toISOString().slice(0, -14)
      })
      this.loadCurrancy()
    }
    this.formGroup.valueChanges.pipe().subscribe((res: any) => {
      this.allowUpdateTemplate = null
      if (res.template_id) {
        if (this.initialTemplateObj) {
          this.allowUpdateTemplate = !this.feeEqualTemplate(res, this.initialTemplateObj) ? res : null
        }
      }
    })
  }

  get isPaid () {
    return this.formGroup.get('paid')?.value
  }

  ngOnInit(): void {
    this.yearOptions = this.getYearOptions()
    this.currancyOptions = this.getCurrancyOptions()
    this.setCopiedApartament()
    this.setPaidDateDisable()
  }

  setPaidDateDisable () {
    const paid = this.formGroup.get('paid')?.value
    if (paid) {
      this.formGroup.get('paidDate')?.enable()
    } else {
      this.formGroup.get('paidDate')?.disable()
    }
  }

  setMonthAndYear (date: string) {
    let patchObj = {}
    if (date) {
      if (this.payDatePrevMonth) {
        let copyOfDate = new Date(new Date(date).valueOf())
        copyOfDate.setMonth(copyOfDate.getMonth() - 1)
        patchObj = {
          month: new Date(copyOfDate).getMonth() + 1,
          year: new Date(copyOfDate).getFullYear()
        }
        console.log(patchObj)
      } else {
        patchObj = {
          month: new Date(date).getMonth() + 1,
          year: new Date(date).getFullYear()
        }
      }
      this.formGroup.patchValue(patchObj, { emitEvent: false } )
    }
  }

  setCopiedApartament () {
    const copied = this.ApartamentFeeServ.getCopiedApartament()
    if (copied) {
      this.formGroup.patchValue({
        name: copied.name,
        description: copied.description,
        sum: copied.sum,
        commission: copied.commission,
        currancy: copied.currancy,
        month: Number(copied.month),
        year: copied.year,
        paid: Boolean(copied.paid),
        organization_id: copied.organization_id,
        template_id: copied.template_id,
        apartament_id: copied.apartament_id,
        organizationTariff_id: copied.organizationTariff_id,
        paidDate: this.isPaid ? copied.paidDate : '',
        payVariant: copied.payVariant,
      })
      this.formGroup.patchValue({
        sum: copied.sum
      })
    }
    setTimeout(() => this.ApartamentFeeServ.setCopiedApartament(null), 0)
  }

  setPayDatePrevMonth (data: boolean) {
    localStorage.setItem('payDatePrevMonth', String(Number(data)))
    const date = this.formGroup.get('paidDate')?.value
    this.setMonthAndYear(date)
  }

  closeTemplateConfirm (confirm: boolean, onlyEmpty: boolean = false) {
    if (confirm) {
      this.assignTemplate(onlyEmpty)
      this.popoverTrigger?.nativeElement.click()
    } else {
      this.formGroup.get('template_id')?.patchValue(null)
      this.popoverTrigger?.nativeElement.click()
    }
  }

  createTemplateOpenModal(data: any) {
    const config = {
      data: { modalInputdata: data}
    }
    this.modalRef = this.modalService.open(ModalCreateFeeTemplateComponent, config)
  }

  private assignTemplate(onlyEmpty: boolean) {
    this.templateOptions$.pipe(take(1)).subscribe(res => {
      if (res && Array.isArray(res)){
        const newForm = res.find((el: any) => +this.formGroup.get('template_id')?.value === +el.id)
        if (newForm) {
          if (onlyEmpty) {
            this.formGroup.patchValue({
              name: this.formGroup.get('name')?.value || newForm.name,
              sum: this.formGroup.get('sum')?.value || newForm.sum,
              currancy: this.formGroup.get('currancy')?.value || newForm.currancy,
              month: this.formGroup.get('month')?.value || newForm.month,
              year: this.formGroup.get('year')?.value || newForm.year,
              apartament_id: this.formGroup.get('apartament_id')?.value || newForm.apartament_id
            })
          } else {
            this.formGroup.patchValue({
              name: newForm.name,
              sum: newForm.sum,
              currancy: newForm.currancy,
              month: newForm.month,
              year: newForm.year,
              apartament_id: newForm.apartament_id
            })
          }
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

  getApartamentFee (id: number) {
    this.loading = true
    this.ApartamentFeeServ.getFee(id).subscribe({
      next: (res: GetFeesApiResponseItem) => {
        this.formGroup.patchValue({
          name: res.name,
          description: res.description,
          sum: res.sum,
          currancy: res.currancy,
          month: res.month,
          year: res.year,
          paid: Boolean(res.paid),
          template_id: res.template_id,
          apartament_id: res.apartament_id,
          paidDate: res.paidDate,
          rateSource: res.rateSource,
          rateId: res.rateId
        })
        this.loading = false
        this.formGroup.patchValue({
          sum: res.sum
        })
      },
      error: (err: any) => {
        this.MessageServ.sendMessage('error', 'Ошибка!', err.error.message)
        this.loading = false
      }
    })
  }

  create() {
    this.loading = true
    const formGroupValue = this.formGroup.value
    let data: ApartamentFeeCreateApiRequest = {
      name: formGroupValue.name,
      description: formGroupValue.description,
      sum: formGroupValue.sum,
      currancy: formGroupValue.currancy,
      month: Number(formGroupValue.month),
      year: formGroupValue.year,
      paid: Boolean(formGroupValue.paid),
      template_id: formGroupValue.template_id,
      apartament_id: formGroupValue.apartament_id,
      paidDate: this.isPaid ? formGroupValue.paidDate : '',
      rateSource: formGroupValue.rateSource,
      rateId: formGroupValue.rateId
    }
    this.ApartamentFeeServ.create(data).subscribe({
      next: (res: any) => {
        this.MessageServ.sendMessage('success', 'Успешно сохранено!', 'Счет добавлен')
        this.loading = false
        if (!res.template_id) {
          this.createTemplateOpenModal(res)
        } else {
          this.Location.back()
        }
      },
      error: (err: any) => {
        this.loading = false
        this.MessageServ.sendMessage('error', 'Ошибка!', err.error.message)
      }
    })
  }

  createAgain() {
    this.loading = true
    const formGroupValue = this.formGroup.value
    let data = {
      name: formGroupValue.name,
      description: formGroupValue.description,
      sum: formGroupValue.sum,
      currancy: formGroupValue.currancy,
      month: Number(formGroupValue.month),
      year: formGroupValue.year,
      paid: Boolean(formGroupValue.paid),
      template_id: formGroupValue.template_id,
      apartament_id: formGroupValue.apartament_id,
      paidDate: this.isPaid ? formGroupValue.paidDate : '',
      rateSource: formGroupValue.rateSource,
      rateId: formGroupValue.rateId
    }
    this.ApartamentFeeServ.create(data).subscribe({
      next: (res: any) => {
        this.MessageServ.sendMessage('success', 'Успешно сохранено!', 'Счет добавлен')
      },
      error: (err: any) => {
        this.MessageServ.sendMessage('error', 'Ошибка!', err.error.message)
      }
    })
    this.redirectTo()
  }

  update() {
    this.loading = true
    const formGroupValue = this.formGroup.value
    let data = {
      id: this.apartamentFee_id,
      name: formGroupValue.name,
      description: formGroupValue.description,
      sum: formGroupValue.sum,
      currancy: formGroupValue.currancy,
      month: Number(formGroupValue.month),
      year: formGroupValue.year,
      paid: Boolean(formGroupValue.paid),
      template_id: formGroupValue.template_id,
      apartament_id: formGroupValue.apartament_id,
      paidDate: this.isPaid ? formGroupValue.paidDate : '',
      rateSource: formGroupValue.rateSource,
      rateId: formGroupValue.rateId
    }
    // console.log(data)
    this.ApartamentFeeServ.update(data).subscribe({
      next: (res: any) => {
        this.MessageServ.sendMessage('success', 'Успешно сохранено!', 'Счет добавлен')
        if (!res.template_id) {
          this.createTemplateOpenModal(res)
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

  makeCopy () {
    const formGroupValue = this.formGroup.value
    let data = {
      name: formGroupValue.name,
      description: formGroupValue.description,
      sum: formGroupValue.sum,
      currancy: formGroupValue.currancy,
      month: Number(formGroupValue.month),
      year: formGroupValue.year,
      paid: Boolean(formGroupValue.paid),
      template_id: formGroupValue.template_id,
      apartament_id: formGroupValue.apartament_id,
      paidDate: this.isPaid ? formGroupValue.paidDate : '',
      rateSource: formGroupValue.rateSource,
      rateId: formGroupValue.rateId
    }
    this.ApartamentFeeServ.setCopiedApartament(data)
    // this.Router.navigate(["/apartament/new"], ) // {skipLocationChange: true}
    this.Router.navigate(['apartamentFee', 'new'])
  }

  back() {
    this.Location.back()
  }

  redirectTo(uri?: string) {
    if (!uri) {
      uri = this.Router.url
    }
    if (this.Router.url === '/login') {
      uri = '/'
    }
    this.Router.navigateByUrl('/', { skipLocationChange: true }).then(()=>
    this.Router.navigate([uri]));
  }

  private saveCurrancy(data: number) {
    localStorage.setItem('fee_currancy', String(data))
  }

  private loadCurrancy() {
    const currancy = localStorage.getItem('fee_currancy')
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

  loadFeeTemplate (id: number) {
    this.FeeTemplateServ.getFeeTemplate(id).subscribe({
      next: (res: FeeTemplateApiResponseItem) => {
        this.initialTemplateObj = res
      },
      error: (err: any) => {
        this.MessageServ.sendMessage('error', 'Ошибка!', err.error.message)
      }
    })
  }

  feeEqualTemplate (fee: any, template: any): boolean {
    return fee.apartament_id === template.apartament_id &&
      fee.name === template.name &&
      fee.description === template.description &&
      fee.sum === template.sum &&
      fee.currancy === template.currancy &&
      fee.month === template.month &&
      fee.year === template.year
  }

  updateTemplateOpenModal () {
    const config = {
      data: {
        template: this.initialTemplateObj,
        fee: this.allowUpdateTemplate
      }
    }
    this.modalRef = this.modalService.open(ModalUpdateFeeTemplateComponent, config)
  }

  setCurrentDayRate (data: GetExchangeRateApiResponse) {
    this.formGroup.patchValue({
      rateSource: 2,
      rateId: data.id
    })
    console.log(this.formGroup.value)
  }

  selectTransfer (data: LoadMoneyTransferApiResponse) {
    this.formGroup.patchValue({
      rateSource: 1,
      rateId: data.id
    })
    console.log(this.formGroup.value)
  }
}
