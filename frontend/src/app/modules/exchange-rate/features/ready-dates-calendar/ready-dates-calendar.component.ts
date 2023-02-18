import { AuthService } from './../../../shared/services/auth/auth.service';
import { ExchangeRateService } from './../../exchange-rate.service';
import { Component, Output, EventEmitter, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { currancyCodes } from '../../../shared/currancyCodes';
import { GetExchangeRateApiResponse, CreateExchangeRateApiRequest } from '../../types';
import { ApilayerApiResponse, QuoteItem } from '../../exchange-rate-list/mock';
import { Quote } from '@angular/compiler';
import { FormGroup, FormControl } from '@angular/forms';


const DAY_MS = 60 * 60 * 24 * 1000;

@Component({
  selector: 'app-ready-dates-calendar',
  templateUrl: './ready-dates-calendar.component.html',
  styleUrls: ['./ready-dates-calendar.component.scss']
})
export class ReadyDatesCalendarComponent implements OnInit, OnChanges {
  @Input() itemsArr: GetExchangeRateApiResponse[] = []
  selectedCurrancyItemsArr: GetExchangeRateApiResponse[] = []
  currancyCodes = currancyCodes
  selectedCurrancy: string = ''
  dates: Array<Date>;
  days = ['Пн', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  date = new Date();
  @Output() selected = new EventEmitter();
  @Output() triggerRefresh = new EventEmitter()
  formGroup: FormGroup = new FormGroup({
    dateFrom: new FormControl(),
    dateTo: new FormControl()
  })
  latestDate: string = new Date().toISOString().slice(0, -14)

  constructor(
    private ExchangeRateServ: ExchangeRateService,
    private AuthServ: AuthService
  ) {
    this.dates = this.getCalendarDays(this.date);
  }

  ngOnInit(): void {
    // console.log(this.isoDateWithoutTimeZone(new Date()))
    this.formGroup.patchValue({
      dateFrom: new Date(this.latestDate).toISOString().slice(0, -14),
      dateTo: this.isoDateWithoutTimeZone(new Date()).slice(0, -14)
    })
  }

  isoDateWithoutTimeZone(date: Date): string {
    if (date == null) return date;
    var timestamp = date.getTime() - date.getTimezoneOffset() * 60000;
    var correctDate = new Date(timestamp);
    correctDate.setUTCHours(0, 0, 0, 0); // uncomment this if you want to remove the time
    return correctDate.toISOString();
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

  getLatestExchangeRateDate (items: any) {
    this.latestDate = items.sort((a: any, b: any) => {
      if (a.date > b.date) {
        return -1
      }
      if (a.date < b.date) {
        return 1
      }
      return 0
    })?.[0]?.date
    if (this.latestDate) {
      console.log(this.isoDateWithoutTimeZone(this.addDays(this.latestDate, 1)).slice(0, -14))
      // const nextDay = new Date(this.addDays(this.latestDate, 1)).toISOString().slice(0, -14)
      this.formGroup.patchValue({
        dateFrom: this.isoDateWithoutTimeZone(this.addDays(this.latestDate, 1)).slice(0, -14),
        dateTo: new Date().toISOString().slice(0, -14)
      })
    }
  }

  addDays(date: string, days: number): Date {
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

  // COMPONENT
  setCurrancyFrom (currancyShortName: string) {
    this.selectedCurrancy = currancyShortName
    const found = currancyCodes.find((el: {
      "shortName": string
      "code": number
      "name": string
      sign?: string
    }) => {
      return el.shortName === currancyShortName
    })
    if (found) {
      this.selectedCurrancyItemsArr = this.itemsArr.filter((el: GetExchangeRateApiResponse) => {
        return found.code === el.currancyFrom
      })
    }
  }

  isset(date: Date) {
    return this.selectedCurrancyItemsArr.find((el: any) => el.date === this.isoDateWithoutTimeZone(date).slice(0, -14))
  }

  getCourses() {
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
              "currancyFromValue": Number(parseFloat(qValue).toFixed(3)),
              _dateCurFromCurTo: Number(date.replace(/-/g,'') + String(currancyFromCode) + String(currancyToCode)),
              source: 2
            }
            createObjs.push(createObj)
          })
        })
        if (createObjs.length) {
          this.batchCreate(createObjs)
        }
      }
    })
  }

  batchCreate (data: CreateExchangeRateApiRequest[]) {
    this.ExchangeRateServ.exchangeRateCreateBatch(data).subscribe({
      next: (res: any) => {
        this.triggerRefresh.emit(true)
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

  getControl(formGroup: FormGroup, formControlId: string): FormControl {
    let formControl: FormControl = new FormControl(null)
    formControl = (formGroup.get(formControlId) as FormControl) || new FormControl(null)
    return formControl
  }

  getAccess (): boolean {
    return this.AuthServ.getAccess({ users: [1] })
  }
}
