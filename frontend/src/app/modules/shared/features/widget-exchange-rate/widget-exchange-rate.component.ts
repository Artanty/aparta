import { AuthService } from './../../../shared/services/auth/auth.service';
import { ExchangeRateService } from '../../../shared/services/exchangeRate/exchange-rate.service';
import { Component, Output, EventEmitter, OnInit, Input, SimpleChanges, OnChanges, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { currancyCodes } from '../../../shared/currancyCodes';
import { GetExchangeRateApiResponse, CreateExchangeRateApiRequest } from '../../../exchange-rate/types';
import { Quote } from '@angular/compiler';
import { FormGroup, FormControl } from '@angular/forms';
import { ApilayerApiResponse } from 'src/app/modules/exchange-rate/exchange-rate-list/mock';

const DAY_MS = 60 * 60 * 24 * 1000;
export type Currancy = {
  "shortName": string
  "code": number
  "name": string
  sign?: string
}
@Component({
  selector: 'app-widget-exchange-rate',
  templateUrl: './widget-exchange-rate.component.html',
  styleUrls: ['./widget-exchange-rate.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WidgetExchangeRateComponent implements OnInit, OnChanges {
    @Input() sourceCurrancy?: number | null
    @Input() destinationCurrancy?: number
    @Input() exchangeRateDate?: string
    innerSourceCurrancy: number = 643
    currancyOptions: any[] = []
    exchangeRates: GetExchangeRateApiResponse[] = []
    selectedCurrancyExchangeRates: GetExchangeRateApiResponse[] = []
    dates: Array<Date>;
    days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
    date = new Date();
    @Output() selected = new EventEmitter();
    @Output() triggerRefresh = new EventEmitter()
    @Output() currentDayValue: EventEmitter<GetExchangeRateApiResponse> = new EventEmitter<GetExchangeRateApiResponse>()

    latestDate: string = new Date().toISOString().slice(0, 10)
    loading: boolean = false
    constructor(
      private ExchangeRateServ: ExchangeRateService,
      private AuthServ: AuthService,
      private ref: ChangeDetectorRef
    ) {
      this.dates = this.getCalendarDays(this.date);
    }

    ngOnInit(): void {
      this.currancyOptions = this.getCurrancyOptions()

    }

    ngOnChanges(changes: SimpleChanges) {
      if ((changes['exchangeRateDate']?.previousValue !== changes['exchangeRateDate']?.currentValue) && changes['exchangeRateDate']?.currentValue) {
        this.setApiDates(this.exchangeRateDate)
        this.date = new Date(changes['exchangeRateDate']?.currentValue)
      }

      this.dates = this.getCalendarDays(this.date);
      this.setCurrancyFrom(changes['sourceCurrancy']?.currentValue)
      if (changes['sourceCurrancy']?.currentValue && (+changes['sourceCurrancy']?.previousValue !== +changes['sourceCurrancy']?.currentValue)) {
        this.getCurrentDayExchangeRate(this.date)
      }
    }

    loadItems (data: any) {
      this.loading = true
      this.ExchangeRateServ.getExchangeRatesByDate(data).subscribe({
        next: (res: GetExchangeRateApiResponse[]) => {
          this.exchangeRates = res
          this.loading = false
          this.setCurrancyFrom(this.sourceCurrancy || this.innerSourceCurrancy)
          this.getCurrentDayExchangeRate(this.date)
        },
        error: (err: any) => {
          this.loading = false
        }
      })
    }

    isoDateWithoutTimeZone(date: Date): string {
      if (date == null) return date;
      var timestamp = date.getTime() - date.getTimezoneOffset() * 60000;
      var correctDate = new Date(timestamp);
      correctDate.setUTCHours(0, 0, 0, 0); // uncomment this if you want to remove the time
      return correctDate.toISOString();
    }

    setApiDates (date: any) {
      if (date) {
        // const data = {
        //   dateFrom: this.isoDateWithoutTimeZone(this.addDays(date, -15)).slice(0, 10),
        //   dateTo: this.isoDateWithoutTimeZone(this.addDays(date, 15)).slice(0, 10)
        // }
        const [year, month] = [new Date(date).getFullYear(), new Date(date).getMonth()];
        const lastDayOfMonth = new Date(year, month + 1, 0).getDate()
        const preDateFrom = new Date(year, month, 1)
        const preDateTo = new Date(year, month, lastDayOfMonth)
        const data = {
          dateFrom: this.isoDateWithoutTimeZone(preDateFrom).slice(0, 10),
          dateTo: this.isoDateWithoutTimeZone(preDateTo).slice(0, 10)
        }
        this.loadItems(data)
      }
    }

    addDays(date: string, days: number): Date {
      var result = new Date(date);
      if ((result.getDate() < Math.abs(days)) && (days < 0) && (new Date(date).getMonth() === 0)) {
        // январь -> декабрь
        result.setMonth(11)
        result.setFullYear(result.getFullYear() - 1)
      } else if ((31 - result.getDate() < (Math.abs(days))) && (days > 0) && (new Date(date).getMonth() === 11)) {
        // декабрь -> январь
        result.setMonth(0)
        result.setFullYear(result.getFullYear() + 1)
      }
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
    setCurrancyFrom (code: string | number | undefined) {
      if (code) {
        const found = currancyCodes.find((el: Currancy) => {
          return el.code === +code
        })
        if (found) {
          this.selectedCurrancyExchangeRates = this.exchangeRates.filter((el: GetExchangeRateApiResponse) => {
            return found.code === el.currancyFrom
          })
          console.log(this.selectedCurrancyExchangeRates)
        }
      }
    }

    isset(date: Date) {
      return this.selectedCurrancyExchangeRates.find((el: any) => el.date === this.isoDateWithoutTimeZone(date).slice(0, 10))
    }

    getControl(formGroup: FormGroup, formControlId: string): FormControl {
      let formControl: FormControl = new FormControl(null)
      formControl = (formGroup.get(formControlId) as FormControl) || new FormControl(null)
      return formControl
    }

    getAccess (): boolean {
      return this.AuthServ.getAccess({ users: [1] })
    }

    getCurrentDayExchangeRate (date: Date): number | null {
      const item = this.selectedCurrancyExchangeRates.find((el: GetExchangeRateApiResponse) => {
        return el.date === this.isoDateWithoutTimeZone(date).slice(0, 10) && el.currancyTo === Number(this.destinationCurrancy)
      })
      const result = item?.currancyFromValue || null
      if (result && (this.isoDateWithoutTimeZone(date).slice(0, 10) === this.isoDateWithoutTimeZone(this.date).slice(0, 10))) {
       this.currentDayValue.emit(item)
      }
      return result
    }

    selectDay(date: Date) {
      const item = this.selectedCurrancyExchangeRates.find((el: GetExchangeRateApiResponse) => {
        return el.date === this.isoDateWithoutTimeZone(date).slice(0, 10) && el.currancyTo === Number(this.destinationCurrancy)
      })
      if (item) {
        this.currentDayValue.emit(item)
      }
    }

    getCurrancyShortName (currancyCode: number | string | undefined): string | undefined {
      if (currancyCode) {
        return currancyCodes.find((el: Currancy) => {
          return Number(currancyCode) === el.code
        })?.shortName
      } else {
        return undefined
      }
    }
    /**
     * Чтобы узнать сколько стоит 1 единица исходной валюты
     * нужно сумму перевода разделить на коэфицент (стоимость валюты), например
     * найти сколько рублей было переведено в 750 евро:
     * 750 / 0.013 = 57-60
     */



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
  }
