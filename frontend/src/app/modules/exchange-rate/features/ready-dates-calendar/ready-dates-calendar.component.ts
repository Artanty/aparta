import { AuthService } from '@services/auth/auth.service';
import { ExchangeRateService } from '@services/exchangeRate/exchange-rate.service';
import { Component, Output, EventEmitter, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { currancyCodes } from '@shared/currancyCodes';
import { GetExchangeRateApiResponse, CreateExchangeRateApiRequest } from '@app/modules/exchange-rate/types';
import { ApilayerApiResponse } from '@app/modules/exchange-rate/exchange-rate-list/mock';
import { UntypedFormGroup, UntypedFormControl } from '@angular/forms';
import { MessageService } from '@services/message/message.service';
import { isoDateWithoutTimeZone } from '@shared/helpers';
import { Observable, tap } from 'rxjs';

const DAY_MS = 60 * 60 * 24 * 1000;

@Component({
  selector: 'app-ready-dates-calendar',
  templateUrl: './ready-dates-calendar.component.html',
  styleUrls: ['./ready-dates-calendar.component.scss']
})

export class ReadyDatesCalendarComponent implements OnInit, OnChanges {
  @Input() itemsArr: GetExchangeRateApiResponse[] = []
  calendarLoading: boolean = false
  selectedCurrancyItemsArr: GetExchangeRateApiResponse[] = []
  currancyCodes = currancyCodes
  selectedCurrancy: string = ''
  dates: Array<Date>;
  days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
  date = new Date();
  @Output() selected = new EventEmitter();
  @Output() triggerRefresh = new EventEmitter()
  formGroup: UntypedFormGroup = new UntypedFormGroup({
    dateFrom: new UntypedFormControl(),
    dateTo: new UntypedFormControl()
  })
  latestDate: string = isoDateWithoutTimeZone(new Date())

  constructor(
    private ExchangeRateServ: ExchangeRateService,
    private AuthServ: AuthService,
    private MessageServ: MessageService
  ) {
    this.dates = this.getCalendarDays(this.date);
  }

  ngOnInit(): void {
    this.formGroup.patchValue({
      dateFrom: this.latestDate,
      dateTo: isoDateWithoutTimeZone(new Date())
    })
    this.getAccess()
  }

  ngOnChanges(changes: SimpleChanges) {
    this.itemsArr = changes['itemsArr'].currentValue
    if (!changes['itemsArr']?.previousValue?.length) {
      this.setCurrancyFrom(this.currancyCodes?.[0]?.shortName)
    }
    if (changes['itemsArr']?.currentValue.length) {
      this.getLatestExchangeRateDate(changes['itemsArr'].currentValue)
    }
  }

  getLatestExchangeRateDate (items: GetExchangeRateApiResponse[]) {
    this.latestDate = items.sort((a: GetExchangeRateApiResponse, b: GetExchangeRateApiResponse) => {
      if (a.date > b.date) {
        return -1
      }
      if (a.date < b.date) {
        return 1
      }
      return 0
    })?.[0]?.date
    if (!this.latestDate) {
      this.latestDate = isoDateWithoutTimeZone(new Date('2022-07-31'))
    }
    let dateFrom = isoDateWithoutTimeZone(new Date())
    if (isoDateWithoutTimeZone(new Date(this.latestDate)) !== isoDateWithoutTimeZone(new Date())) {
      dateFrom = isoDateWithoutTimeZone(this.addDays(this.latestDate, 1))
    }
    this.formGroup.patchValue({
      dateFrom: dateFrom,
      dateTo: isoDateWithoutTimeZone(new Date())
    })
  }

  addDays (date: string, days: number): Date {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  setMonth(inc: any) {
    const [year, month] = [this.date.getFullYear(), this.date.getMonth()];
    this.date = new Date(year, month + inc, 1);
    this.dates = this.getCalendarDays(this.date);
  }

  isSameMonth(date: any) {
    return date.getMonth() === this.date.getMonth();
  }

  private getCalendarDays(date = new Date) {
    if (!date) {
      date = new Date()
    }
    const calendarStartTime =  this.getCalendarStartDay(date).getTime();

    return this.range(0, 41)
      .map(num => new Date(calendarStartTime + DAY_MS * num));
  }

  private getCalendarStartDay(date = new Date): any {
    const [year, month] = [date.getFullYear(), date.getMonth()];
    const firstDayOfMonth = new Date(year, month, 1).getTime();

    return this.range(1,7)
      .map(num => new Date(firstDayOfMonth - DAY_MS * num))
      .find(dt => dt.getDay() === 1)
  }

  private range(start: any, end: any, length = end - start + 1): any[] {
    return Array.from({ length }, (_, i) => start + i)
  }

  setCurrancyFrom (currancyShortName: string) {
    this.selectedCurrancy = currancyShortName
    const foundCurrancyCode = currancyCodes.find((el: {
      "shortName": string
      "code": number
      "name": string
      sign?: string
    }) => {
      return el.shortName === currancyShortName
    })
    if (foundCurrancyCode) {
      this.selectedCurrancyItemsArr = this.itemsArr.filter((el: GetExchangeRateApiResponse) => {
        return foundCurrancyCode.code === el.currancyFrom
      })
      this.getLatestExchangeRateDate(this.selectedCurrancyItemsArr)
    }
  }

  isset(date: Date) {
    return this.selectedCurrancyItemsArr.find((el: any) => el.date === isoDateWithoutTimeZone(date))
  }

  getCourses() {
    this.calendarLoading = true
    const data = {
      dateFrom: this.formGroup.get('dateFrom')?.value,
      dateTo: this.formGroup.get('dateTo')?.value,
      source: this.selectedCurrancy
    }
    this.ExchangeRateServ.getCourses(data).subscribe({
      next: (res: ApilayerApiResponse) => {
        const createObjs: CreateExchangeRateApiRequest[] = []
        Object.entries(res.quotes).forEach(([date, quoteItems]: any) => {
          Object.entries(quoteItems).forEach(([qKey, qValue]: any) => {
            const currancyToCode = this.getCurrancyCode(qKey.replace(this.selectedCurrancy, ''))
            const currancyFromCode = this.getCurrancyCode(res.source)
            const createObj: CreateExchangeRateApiRequest = {
              "date": date,
              "currancyFrom": currancyFromCode,
              "currancyTo": currancyToCode,
              "currancyFromValue": Number(parseFloat(qValue).toFixed(4)),
              _dateCurFromCurTo: Number(date.replace(/-/g,'') + String(currancyFromCode) + String(currancyToCode)),
              source: 2
            }
            createObjs.push(createObj)
          })
        })
        if (createObjs.length) {
          this.MessageServ.sendMessage('success', 'Курсы валют получены', `Добавлено ${createObjs.length} курсов валют получены из внешнего источника`)
          this.batchCreate(createObjs)
        } else {
          this.MessageServ.sendMessage('warning', 'Внимание!', 'Список полученных курсов валют пуст')
        }
      },
      error: (err: any) => {
        this.calendarLoading = false
        this.MessageServ.sendMessage('error', 'Ошибка!', err.error.message)
      }
    })
  }

  batchCreate (data: CreateExchangeRateApiRequest[]) {
    this.ExchangeRateServ.exchangeRateCreateBatch(data).subscribe({
      next: (res: CreateExchangeRateApiRequest[]) => {
        this.triggerRefresh.emit(true)
        this.calendarLoading = false
      },
      error: (err: any) => {
        this.calendarLoading = false
        this.MessageServ.sendMessage('error', 'Ошибка!', err.error.message)
      }
    })
  }


  getCurrancyCode (currancyShortName: string): number {
    return currancyCodes.find((el: {
      "shortName": string
      "code": number
      "name": string
      sign?: string
    }) => {
      return el.shortName === currancyShortName
    })?.code || 0
  }

  getControl(formGroup: UntypedFormGroup, formControlId: string): UntypedFormControl {
    let formControl: UntypedFormControl = new UntypedFormControl(null)
    formControl = (formGroup.get(formControlId) as UntypedFormControl) || new UntypedFormControl(null)
    return formControl
  }

  getAccess (): Observable<boolean>{
    return this.AuthServ.getAccess({ users: [1] })
  }
}
