import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common'
import { MessageService } from '../../shared/services/message/message.service';
import { ApartamentFeeService } from '../../shared/services/apartamentFee/apartament-fee.service';
import { currancyCodes } from './../../shared/currancyCodes';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { ModalCreateFeeTemplateComponent } from './modal-create-fee-template/modal-create-fee-template.component'
import { map, Observable, of, take, startWith, combineLatestWith } from 'rxjs';
import { FeeTemplateService } from '../../shared/services/feeTemplate/fee-template.service';
import { ApartamentService } from '../../shared/services/apartament/apartament.service';
import { FeeTemplateApiResponseItem, FeeTemplateUpdateApiRequest } from '../../shared/services/feeTemplate/types';
import { ApartamentFeeCreateApiRequest, ApartamentFeeCreateApiResponse, GetFeesApiResponseItem, UpdateFeeApiReqest } from '../../shared/services/apartamentFee/types';
import { ModalUpdateFeeTemplateComponent } from './modal-update-fee-template/modal-update-fee-template.component';
import { GetExchangeRateApiResponse } from '../../exchange-rate/types';
import { LoadMoneyTransferApiResponse } from '../../shared/services/moneyTransfer/types';
import { getYearOptions, monthOptions } from '@shared/helpers';

export enum EExchangeRateSource {
  MONEY_TRANSFER_LIST = 1,
  EXCHANGE_RATE_LIST = 2
}
type SettingsFormGroupValue = {
  bindToPaidDate: boolean
  payDatePrevMonth: boolean
  backOnSave: boolean
}

@Component({
  selector: 'app-apartament-fee-create',
  templateUrl: './apartament-fee-create.component.html',
  styleUrls: ['./apartament-fee-create.component.scss']
})
export class ApartamentFeeCreateComponent implements OnInit {
  monthOptions = monthOptions
  getYearOptions = getYearOptions
  initialTemplateObj: FeeTemplateApiResponseItem | FeeTemplateUpdateApiRequest | null = null
  allowUpdateTemplate: null | GetFeesApiResponseItem = null
  apartamentFee_id: number = 0
  @ViewChild ('popoverTrigger') popoverTrigger: ElementRef | undefined
  modalRef: MdbModalRef<ModalCreateFeeTemplateComponent | ModalUpdateFeeTemplateComponent> | null = null
  loading: boolean = false
  formGroup: UntypedFormGroup = new UntypedFormGroup({
    apartament_id: new UntypedFormControl(null, [Validators.required]),
    name: new UntypedFormControl(null, [Validators.required]),
    description: new UntypedFormControl(null),
    sum: new UntypedFormControl(null),
    currancy: new UntypedFormControl(null),
    month: new UntypedFormControl(null),
    year: new UntypedFormControl(null),
    paid: new UntypedFormControl(true),
    paidDate: new UntypedFormControl(null),
    template_id: new UntypedFormControl(null),
    rateSource: new UntypedFormControl(null),
    rateId: new UntypedFormControl(null)
  })
  settingsformGroup: UntypedFormGroup = new UntypedFormGroup({
    bindToPaidDate: new UntypedFormControl(null),
    payDatePrevMonth: new UntypedFormControl(null),
    backOnSave: new UntypedFormControl(null),
  })
  yearOptions: any[] = getYearOptions()
  currancyOptions: any[] = []

  templateOptions$: Observable<any[]>
  apartamentOptions$: Observable<any[]>
  EExchangeRateSource = EExchangeRateSource
  formGroup2: UntypedFormGroup = new UntypedFormGroup({
    radio: new UntypedFormControl(EExchangeRateSource.MONEY_TRANSFER_LIST)
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

    this.settingsformGroup.valueChanges.subscribe((res: SettingsFormGroupValue) => {
      localStorage.setItem('backOnSave', String(Number(res.backOnSave)))
      localStorage.setItem('payDatePrevMonth', String(Number(res.payDatePrevMonth)))
      const paidDate = this.formGroup.get('paidDate')?.value
      if (paidDate) {
        this.setMonthAndYear(paidDate)
      }
    })

    this.formGroup2.valueChanges.subscribe((res: any) => {
      console.log(res)
    })

    this.FeeTemplateServ.getFeeTemplates().subscribe()
    this.ApartamentServ.getApartaments().subscribe()

    this.templateOptions$ = this.FeeTemplateServ.feeTemplates$.pipe(
      combineLatestWith(this.formGroup.get('apartament_id')?.valueChanges.pipe(startWith(Number(this.ActivatedRoute.snapshot.paramMap.get('apartament_id')))) || of(this.formGroup.get('apartament_id')?.value)),
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
    this.formGroup.get('template_id')?.valueChanges.subscribe((res: number | string | null) => {
      if (res !== null && res !== 'null') {
        this.loadFeeTemplate(Number(res))
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
    this.currancyOptions = this.getCurrancyOptions()
    this.setCopiedApartament()
    this.setPaidDateDisable()
    this.initSettings()
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
    if (this.getControl(this.settingsformGroup, 'bindToPaidDate')?.value === true) {
      let patchObj = {}
      if (date) {
        if (this.getControl(this.settingsformGroup, 'payDatePrevMonth')?.value === true) {
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
  }

  setCopiedApartament () {
    const copied = this.ApartamentFeeServ.getCopiedApartament()
    if (copied) {
      this.formGroup.patchValue({
        name: copied.name,
        description: copied.description,
        sum: copied.sum,
        currancy: copied.currancy,
        month: Number(copied.month),
        year: copied.year,
        paid: Boolean(copied.paid),
        template_id: copied.template_id,
        apartament_id: copied.apartament_id,
        paidDate: this.isPaid ? copied.paidDate : ''
      })
      this.formGroup.patchValue({
        sum: copied.sum
      })
    }
    setTimeout(() => this.ApartamentFeeServ.setCopiedApartament(null), 0)
  }

  initSettings () {
    const data = {
      payDatePrevMonth: Boolean(Number(localStorage.getItem('payDatePrevMonth'))),
      bindToPaidDate: !this.apartamentFee_id,
      backOnSave: Boolean(Number(localStorage.getItem('backOnSave')))
    }
    this.settingsformGroup.patchValue(data)
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
    this.modalRef.onClose.subscribe((res: null | FeeTemplateUpdateApiRequest) => {
      this.bugSetTemplateIdAfterModal()
      this.afterAction()
    })
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
              apartament_id: this.formGroup.get('apartament_id')?.value || newForm.apartament_id,
              paidDate: this.formGroup.get('paidDate')?.value || newForm.paidDate
            })
          } else {
            this.formGroup.patchValue({
              name: newForm.name,
              sum: newForm.sum,
              currancy: newForm.currancy,
              month: newForm.month,
              year: newForm.year,
              apartament_id: newForm.apartament_id,
              paidDate: newForm.paidDate
            })
          }
        }
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
        console.log(res.year)
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
          this.afterAction()
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
      next: (res: ApartamentFeeCreateApiResponse) => {
        this.MessageServ.sendMessage('success', 'Успешно сохранено!', 'Счет добавлен')
        this.ApartamentFeeServ.setCopiedApartament(data)
        this.Router.navigate(['apartamentFee', 'new'])
        this.loading = false
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
    let data: UpdateFeeApiReqest = {
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
    this.ApartamentFeeServ.update(data).subscribe({
      next: (res: any) => {
        this.MessageServ.sendMessage('success', 'Успешно сохранено!', 'Счет сохранен')
        if (!res.template_id) {
          this.createTemplateOpenModal(res)
        } else {
          this.afterAction()
        }
        this.loading = false
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
    this.ApartamentFeeServ.setCopiedApartament(data)
    this.Router.navigate(['apartamentFee', 'new'])
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

  getControl(formGroup: UntypedFormGroup, formControlId: string): UntypedFormControl {
    let formControl: UntypedFormControl = new UntypedFormControl(null)
    formControl = (formGroup.get(formControlId) as UntypedFormControl) || new UntypedFormControl(null)
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
      fee.paidDate === template.paidDate
  }

  updateTemplateOpenModal () {
    const config = {
      data: {
        template: this.initialTemplateObj,
        fee: this.allowUpdateTemplate as ApartamentFeeCreateApiRequest
      }
    }
    this.modalRef = this.modalService.open(ModalUpdateFeeTemplateComponent, config)
    this.modalRef?.onClose.subscribe((res: null | FeeTemplateUpdateApiRequest) => {
      if (res !== null) {
        this.initialTemplateObj = res
        this.bugSetTemplateIdAfterModal()
      }
    })

  }

  bugSetTemplateIdAfterModal () {
    const templateId = this.getControl(this.formGroup, 'template_id').value
    this.formGroup.patchValue({
      template_id: templateId
    }, { emitEvent: false })
  }

  setCurrentDayRate (data: GetExchangeRateApiResponse) {
    this.formGroup.patchValue({
      rateSource: 2,
      rateId: data.id
    })
  }

  selectTransfer (data: LoadMoneyTransferApiResponse) {
    this.formGroup.patchValue({
      rateSource: 1,
      rateId: data.id
    })
  }

  afterAction () {
    if (this.getControl(this.settingsformGroup, 'backOnSave')?.value === true) {
      this.back()
    }
  }

  back() {
    this.Location.back()
  }
}
