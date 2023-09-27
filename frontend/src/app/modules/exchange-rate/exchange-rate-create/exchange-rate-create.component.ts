import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { Location } from '@angular/common'
import { MessageService } from '../../shared/services/message/message.service';
import { currancyCodes } from './../../shared/currancyCodes';
import { Observable } from 'rxjs';
import { ApartamentService } from '../../shared/services/apartament/apartament.service';
import { ExchangeRateService } from '../../shared/services/exchangeRate/exchange-rate.service';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-exchange-rate-create',
  templateUrl: './exchange-rate-create.component.html',
  styleUrls: ['./exchange-rate-create.component.scss']
})
export class ExchangeRateCreateComponent implements OnInit {

    loading: boolean = false
    currancyOptions: any[] = []
    exchangeRate_id: number = 0

    formGroup: UntypedFormGroup = new UntypedFormGroup({
      date: new UntypedFormControl(new Date().toISOString().slice(0, -14)),
      currancyFrom: new UntypedFormControl(null),
      currancyTo: new UntypedFormControl(null),
      currancyFromValue: new UntypedFormControl(null),
    })

    constructor(
      private ExchangeRateServ: ExchangeRateService,
      private MessageServ: MessageService,
      private ActivatedRoute: ActivatedRoute,
      private Location: Location
    ) {
      const exchangeRate_id = Number(this.ActivatedRoute.snapshot.paramMap.get('exchangeRate_id'))
      if (exchangeRate_id) {
        this.exchangeRate_id = exchangeRate_id
        this.getExchangeRate(+exchangeRate_id)
      }
    }

    ngOnInit(): void {
      this.currancyOptions = this.getCurrancyOptions()
    }

    back(){
      this.Location.back()
    }

    private getCurrancyOptions () {
      if (Array.isArray(currancyCodes)) {
        return currancyCodes.slice(0, 4).map((el: any) => {
          return { name: el.sign || el.shortName, id: el.code }
        })
      }
      return []
    }

    getExchangeRate(id: number) {
      this.loading = true
      this.ExchangeRateServ.getExchangeRate(id).subscribe({
        next: (res: any) => {
          this.loading = false
          this.formGroup.patchValue({
            date: res.date,
            currancyFrom: res.currancyFrom,
            currancyTo: res.currancyTo,
            currancyFromValue: res.currancyFromValue
          })
        },
        error: (err: any) => {
          this.loading = false
          this.MessageServ.sendMessage('error', 'Ошибка!', err.error.message)
        }
      })
    }

    create() {
      this.loading = true
      const fgv = this.formGroup.value
      let data = {
        date: fgv.date,
        currancyFrom: fgv.currancyFrom,
        currancyTo: fgv.currancyTo,
        currancyFromValue: fgv.currancyFromValue,
        _dateCurFromCurTo: Number(fgv.date.replace(/-/g,'') + String(fgv.currancyFrom) + String(fgv.currancyTo)),
        source: 1
      }

      this.ExchangeRateServ.create(data).subscribe({
        next: (res: any) => {
          this.MessageServ.sendMessage('success', 'Успешно сохранено!', 'Курс валют добавлен')
          this.loading = false
          this.back()
        },
        error: (err: any) => {
          console.log(err)
          this.loading = false
          this.MessageServ.sendMessage('error', 'Ошибка!', err.error.message)
        }
      })
    }

    update() {
      this.loading = true
      const formGroupValue = this.formGroup.value
      let data = {
        date: formGroupValue.date,
        currancyFrom: formGroupValue.currancyFrom,
        currancyTo: formGroupValue.currancyTo,
        currancyFromValue: formGroupValue.currancyFromValue,
      } as any
      data.id = this.exchangeRate_id

      this.ExchangeRateServ.update(data).subscribe({
        next: (res: any) => {
          this.MessageServ.sendMessage('success', 'Успешно сохранено!', 'Курс валют обновлен')
          this.loading = false
          this.back()
        },
        error: (err: any) => {
          this.loading = false
          this.MessageServ.sendMessage('error', 'Ошибка!', err.error.message)
        }
      })
    }

    getControl(formGroup: UntypedFormGroup, formControlId: string): UntypedFormControl {
      let formControl: UntypedFormControl = new UntypedFormControl(null)
      formControl = (formGroup.get(formControlId) as UntypedFormControl) || new UntypedFormControl(null)
      return formControl
    }
  }
