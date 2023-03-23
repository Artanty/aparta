import { HelperService } from './../../shared/services/helper/helper.service';
import { LoadMoneyTransferApiResponse } from '@shared/services/moneyTransfer/types';
import { MoneyTransferService } from '@shared/services/moneyTransfer/money-transfer.service'
import { ExchangeRateService, GetExchangeRatesByDateAndCurrancyApiRequest } from './../../shared/services/exchangeRate/exchange-rate.service';
import { Component, ElementRef, OnDestroy, OnInit, Output, ViewChild, EventEmitter, Input } from '@angular/core';
import { combineLatest, combineLatestWith, concat, concatMap, filter, finalize, forkJoin, map, Observable, of, skipWhile, startWith, Subscription, tap, withLatestFrom } from 'rxjs';
import { ApartamentFeeService } from '../../shared/services/apartamentFee/apartament-fee.service';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { MessageService } from '../../shared/services/message/message.service';
import { isNonNull, orderBy, removeDuplicatedObj, throttle } from '../../shared/helpers';
import { FormControl, FormGroup } from '@angular/forms';
import { GetCurrancyPipe } from '../../shared/pipes/get-currancy.pipe';
import { GetFeesApiResponseItem } from '../../shared/services/apartamentFee/types';
import { MdbPopoverDirective } from 'mdb-angular-ui-kit/popover';
import { GetExchangeRateApiResponse } from '../../exchange-rate/types';
import { CurrancyValuePipe } from '@pipes/currancy-value.pipe';
import { CurrencyService } from '@shared/services/currency/currency.service';
import { ECurrencyPipeStatus } from '@pipes/currency-value/enums';

@Component({
  selector: 'app-apartament-fee-list',
  templateUrl: './apartament-fee-list.component.html',
  styleUrls: ['./apartament-fee-list.component.scss']
})
export class ApartamentFeeListComponent implements OnInit, OnDestroy {
  throttledGetExchangeRates = this.h.throttle(this.getExchangeRates.bind(this), 1000, true)
  throttledGgetMoneyTransfers = this.h.throttle(this.getMoneyTransfers.bind(this), 1000, true)
  deleteConfirmOpened: MdbPopoverDirective | null = null
  currancy: number = 941
  @Input() set _currancy(value: number) {
    this.currancy = value;
    setTimeout(() => {
      this.filterFormGroup.updateValueAndValidity()
    }, 0)
    this.throttledGetExchangeRates()
    this.throttledGgetMoneyTransfers()
    // console.log('currency change')
  }

  @Input() set _year(year: number) {
    if (year) {
      this.throttledGetItems(year)
      // console.log('year change')
    }
  }
  @Output() amountOut: EventEmitter<any> = new EventEmitter<any>()
  apartament_id: string = ''
  tableLoading$: Observable<boolean>
  items$?: Observable<any>
  selectedItemsSet = new Set()
  name: FormControl = new FormControl(null)
  month: FormControl = new FormControl(null)

  filterFormGroup: FormGroup = new FormGroup({
    name: this.name,
    month: this.month
  })
  sortFormGroup: FormGroup = new FormGroup({
    sum: new FormControl(0),
    month: new FormControl(0),
    paidDate: new FormControl(1),
    created_at: new FormControl(0)
  })
  nameOptions: any[] = []
  subs$?: Subscription
  moneyTransfers: LoadMoneyTransferApiResponse[] = []
  exchangeRates: GetExchangeRateApiResponse[] = []

  constructor(
    private ApartamentFeeServ: ApartamentFeeService,
    private ActivatedRoute: ActivatedRoute,
    private MessageServ: MessageService,
    private Router: Router,
    private ExchangeRateServ: ExchangeRateService,
    private MoneyTransferServ: MoneyTransferService,
    private CurrencyServ: CurrencyService,
    private h: HelperService
  ) {

    this.tableLoading$ = this.ApartamentFeeServ.loading$
    let obs$: Observable<any>

    const tapPipeSetSelectOptions = (res: GetFeesApiResponseItem[]) => {
      const values = removeDuplicatedObj(res, 'name').sort((a: GetFeesApiResponseItem, b: GetFeesApiResponseItem) => a.name.localeCompare(b.name))
      this.nameOptions.push(...values)
    }

    const mapPipeFilterAndSort = (res: any) => {
      this.saveTableState()
      let items = res[0]
      const filters = res[1]
      const sort = res[2]
      if (filters) {
        items = items.filter((el: any) => {
          let itemFiltered: boolean = false
          let result = true
          Object.keys(filters).forEach((filter: any) => {
            if (filters[filter] && !itemFiltered) {
              result = String(el[filter]) === String(filters[filter])
              if (result === false) {
                itemFiltered = true
              }
            }
          })
          return result
        })
      }
      if (sort.sum && sort.sum !== 0) {
        const format = (obj: any) => {
          if (obj.currancy !== this.currancy) {
            return new GetCurrancyPipe().transform(obj, 'currancy', 'sum', this.currancy)
          }
          return obj.sum
        }
        items = orderBy(items, format, sort.sum > 0 ? 'asc' : 'desc', )
      } else if (sort.month && sort.month !== 0) {
        const format = (obj: any) => {
          const date = new Date()
          return date.setMonth(obj.month)
        }
        items = orderBy(items, format, sort.month > 0 ? 'asc' : 'desc', )
      } else if (sort.paidDate && sort.paidDate !== 0) {
        items = orderBy(items, (el: any)=> new Date(el.paidDate).getTime(), sort.paidDate > 0 ? 'asc' : 'desc')
      } else if (sort.created_at && sort.created_at !== 0){
        items = orderBy(items, (el: any)=> new Date(el.created_at).getTime(), sort.created_at > 0 ? 'asc' : 'desc')
      } else {
        items = orderBy(items, 'name', 'asc')
      }
      return items
    }

    const mapPipeCountAmount = (res: any) => {
      let amount = res.reduce((acc: any, current: any) => {
        let currentValue = current.sum
        if (current.currancy !== this.currancy) {
          const pipeResult = new CurrancyValuePipe(this.CurrencyServ).transform(current, this.currancy, this.moneyTransfers, this.exchangeRates)
          currentValue = pipeResult.valueTo
          if (pipeResult.status === ECurrencyPipeStatus.DANGER) {
            acc.dangers.push(pipeResult)
          }
        }
        acc.value = acc.value + +currentValue
        return acc
      }, { value: 0, dangers: [] })
      this.amountOut.emit(amount)
      return res
    }

    this.ActivatedRoute.params.subscribe((res: any) => {
      if (res.apartament_id) {
        this.apartament_id = res.apartament_id
        this.throttledGetItems()
        this.filterFormGroup.reset()
      }
    })
    obs$ = this.ApartamentFeeServ.fees$
    this.items$ = this.ApartamentFeeServ.fees$.pipe(
      filter(isNonNull),
      tap(tapPipeSetSelectOptions),
      map((res: GetFeesApiResponseItem[]) => orderBy(res, (el: GetFeesApiResponseItem) => new Date(el.paidDate || 1).getTime(), 'asc')),
      combineLatestWith(this.filterFormGroup.valueChanges, this.sortFormGroup.valueChanges),
      map(mapPipeFilterAndSort),
      map(mapPipeCountAmount)
    )

    this.subs$ = obs$.pipe(
      skipWhile((res: any) => !res.length)
      ).subscribe({
      next: (res: any) => {
        this.MessageServ.sendMessage('success', '', 'Счетa загружены')
        setTimeout(()=>{
          this.loadTableState()
        }, 0)
      },
      error: (err: any) => {
        this.MessageServ.sendMessage('error', 'Ошибка!', err.error.message)
      }
    })
  }

  ngOnInit(): void {
    //
  }

  ngOnDestroy (): void {
    // console.log('destroyed')
    this.subs$?.unsubscribe()
  }

  getYearDates (year: number) {
    return {
      dateFrom: this.isoDateWithoutTimeZone(new Date(year, 0, 1)).slice(0, 10),
      dateTo: this.isoDateWithoutTimeZone(new Date(year, 11, 31)).slice(0, 10)
    }
  }
  throttledGetItems = this.h.throttle(this.getRatesAndItems.bind(this), 1000)

  getRatesAndItems (year?: number) {
    // this.loading = true
    if (!year) {
      year = new Date().getFullYear()
    }
    const ratesParams: GetExchangeRatesByDateAndCurrancyApiRequest = { currancyTo: +this.currancy, ...this.getYearDates(year) }
    const apartament_id = this.apartament_id !== 'all' ? +this.apartament_id : 'all'
    forkJoin(
      {
        exchangeRates: this.ExchangeRateServ.getExchangeRatesByDateAndCurrancy(ratesParams),
        moneyTransfers: this.MoneyTransferServ.load(),
        fees: this.ApartamentFeeServ.getFees(apartament_id, true, year as number)
      }
    )
    .subscribe({
      next: (res: {
        exchangeRates: GetExchangeRateApiResponse[],
        moneyTransfers: LoadMoneyTransferApiResponse[],
        fees: GetFeesApiResponseItem[]
      }) => {
        this.exchangeRates = res.exchangeRates
        this.moneyTransfers = res.moneyTransfers
      },
      error: (err: any) => {
        this.MessageServ.sendMessage('error', 'Ошибка!', err.error.message)
      }
    })
  }

  getExchangeRates (year?: number) {
    if (!year) {
      year = new Date().getFullYear()
    }
    const ratesParams: GetExchangeRatesByDateAndCurrancyApiRequest = { currancyTo: +this.currancy, ...this.getYearDates(year) }
    this.ExchangeRateServ.getExchangeRatesByDateAndCurrancy(ratesParams).subscribe({
      next: (res: GetExchangeRateApiResponse[]) => {
        this.exchangeRates = res
        this.loadTableState()
      },
      error: (err: any) => {
        this.MessageServ.sendMessage('error', 'Ошибка!', err.error.message)
      }
    })
  }

  getMoneyTransfers () {
    this.MoneyTransferServ.load().subscribe({
      next: (res: LoadMoneyTransferApiResponse[]) => {
        this.moneyTransfers = res
        this.loadTableState()
      },
      error: (err: any) => {
        this.MessageServ.sendMessage('error', 'Ошибка!', err.error.message)
      }
    })
  }

  getFees (year?: number) {
    if (!year) {
      year = new Date().getFullYear()
    }
    const apartament_id = this.apartament_id !== 'all' ? +this.apartament_id : 'all'
    this.ApartamentFeeServ.getFees(apartament_id, true, year as number).subscribe({
      next: (res: GetFeesApiResponseItem[]) => {
        //
      },
      error: (err: any) => {
        this.MessageServ.sendMessage('error', 'Ошибка!', err.error.message)
      }
    })
  }

  tableSort(column: string){
    let value: number
    const currentValue = this.sortFormGroup.controls[column].value
    if (currentValue === 1) value = 0
    if (currentValue === 0) value = -1
    if (currentValue === -1) value = 1
    const patchObject = Object.keys(this.sortFormGroup.controls)
    .reduce((acc: any, key: string) => {
      return {
        ...acc,
        [key]: key === column ? value : 0
      }
    }, {})
    this.sortFormGroup.patchValue(patchObject)
  }

  selectItem (id: number) {
    if (this.selectedItemsSet.has(id)) {
      this.selectedItemsSet.delete(id)
    } else {
      this.selectedItemsSet.add(id)
    }
  }

  copyApartamentFee (id: number) {
    this.ApartamentFeeServ.getFee(id).subscribe({
      next: (res: GetFeesApiResponseItem) => {
        let data = {
          name: res.name,
          description: res.description,
          sum: res.sum,
          currancy: res.currancy,
          month: Number(res.month),
          year: res.year,
          paid: Boolean(res.paid),
          template_id: res.template_id,
          apartament_id: res.apartament_id,
          paidDate: res.paidDate,
          rateSource: res.rateSource,
          rateId: res.rateId
        }
        data.sum = res.sum
        this.ApartamentFeeServ.setCopiedApartament(data)
        this.Router.navigate(['apartamentFee', 'new'])
      },
      error: (err: any) => {
        this.MessageServ.sendMessage('error', 'Ошибка!', err.error.message)
      }
    })
  }

  deleteConfirmOnOpen(data: MdbPopoverDirective){
    if (this.deleteConfirmOpened) {
      this.deleteConfirmOpened?.hide()
    }
    this.deleteConfirmOpened = data
  }

  deleteConfirm (confirm: boolean, id: number) {
    if (confirm) {
      this.deleteConfirmOpened?.hide()
      this.deleteConfirmOpened = null
      this.delete(id)
    } else {
      this.deleteConfirmOpened?.hide()
      this.deleteConfirmOpened = null
    }
  }

  delete(id: number) {
    this.ApartamentFeeServ.setLoading(true)
    this.ApartamentFeeServ.delete(id).subscribe({
      next: (res: any) => {
        this.MessageServ.sendMessage('success', 'Успешно!', 'Счет удален')
        this.ApartamentFeeServ.setLoading(false)
        this.selectedItemsSet.delete(id)
      },
      error: (err: any) => {
        this.MessageServ.sendMessage('error', 'Ошибка!', err.error.message)
        this.ApartamentFeeServ.setLoading(false)
      }
    })
  }

  deleteSelected () {
    concat(Array.from(this.selectedItemsSet).map((id: any) => this.delete(id))).pipe(
      finalize(() => {
        // this.MessageServ.sendMessage('success', 'Успешно!', 'Выбранные счета удалены')
      })
    ).subscribe()

  }

  filterFormGroupResetControl(controlName: string) {
    this.filterFormGroup.controls[controlName]?.reset()
  }

  saveTableState() {
    const data = {
      sort: this.sortFormGroup.value,
      filter: this.filterFormGroup.value
    }
    localStorage.setItem('apartamentFeeList', JSON.stringify(data))
  }

  loadTableState(){
    const state = localStorage.getItem('apartamentFeeList')
    if (state) {
      // console.log(JSON.parse(state).filter)
      this.sortFormGroup.patchValue(JSON.parse(state).sort)
      this.filterFormGroup.patchValue(JSON.parse(state).filter)
    } else {
      this.filterFormGroup.updateValueAndValidity()
      this.sortFormGroup.updateValueAndValidity()
    }
  }

  isoDateWithoutTimeZone(date: Date): string {
    if (date == null) return date;
    var timestamp = date.getTime() - date.getTimezoneOffset() * 60000;
    var correctDate = new Date(timestamp);
    correctDate.setUTCHours(0, 0, 0, 0); // uncomment this if you want to remove the time
    return correctDate.toISOString();
  }

  loadMoneyTransfersApi() {
    return this.MoneyTransferServ.load()
  }
}
