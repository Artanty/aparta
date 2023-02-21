import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common'
import { MessageService } from '../../shared/services/message/message.service';
import { currancyCodes } from './../../shared/currancyCodes';

import { Observable } from 'rxjs';
import { ApartamentService } from '../../shared/services/apartament/apartament.service';
import { MoneyTransferService } from '../../shared/services/moneyTransfer/money-transfer.service';
import { Currancy } from '../../shared/features/widget-exchange-rate/widget-exchange-rate.component';
import { GetExchangeRateApiResponse } from '../../exchange-rate/types';


@Component({
  selector: 'app-money-transfer-update',
  templateUrl: './money-transfer-update.component.html',
  styleUrls: ['./money-transfer-update.component.scss'],

})
export class MoneyTransferUpdateComponent implements OnInit {
    correctedSum1Value: number | null = null
    currentDayValue: number | null = null
    currentDayValueNoCommision: number | null = null
    loading: boolean = false
    formGroup: FormGroup = new FormGroup({
      id: new FormControl(null),
      description: new FormControl(643),
      sourceSum: new FormControl(null),
      sourceCurrancy: new FormControl(null),
      middleTransfers: new FormControl(null),
      destinationSum: new FormControl(null),
      destinationCurrancy: new FormControl(null),
      rate: new FormControl(null),
      date: new FormControl(new Date().toISOString().slice(0, 10)),
      apartament_id: new FormControl(3)
    })
    formGroup2: FormGroup = new FormGroup({
      sourceCurrancy: new FormControl(null),
      destinationCurrancy: new FormControl(null)
    })
    pasteResultToFC: string = ''
    quantityFC: string = ''
    activeGetSumNumber: number | null = null

    currancyOptions: any[] = []
    apartamentOptions$: Observable<any[]>
    moneyTransfer_id: number = 0
    oneUnitValue: number | null = null
    constructor(
      private ApartamentServ: ApartamentService,
      private MoneyTransferServ: MoneyTransferService,
      private MessageServ: MessageService,
      private ActivatedRoute: ActivatedRoute,
      private Location: Location,
    ) {
      try {
        const moneyTransfer_id = Number(this.ActivatedRoute.snapshot.paramMap.get('moneyTransfer_id'))
        if (moneyTransfer_id) {
          this.moneyTransfer_id = moneyTransfer_id
          this.getMoneyTransfer(moneyTransfer_id)
        }
      } catch (error) {
        this.Location.back()
      }
      this.apartamentOptions$ = this.ApartamentServ.apartaments$
      this.ApartamentServ.getApartaments().subscribe()
    }

    ngOnInit(): void {
      this.currancyOptions = this.getCurrancyOptions()
    }

    setCurrentDayValue (data: GetExchangeRateApiResponse) {
      this.currentDayValueNoCommision = data.currancyFromValue
      const currancyValue = this.getValueWithCommision(data.currancyFromValue)
      this.currentDayValue = currancyValue
      const quantity = this.getControl(this.formGroup, this.quantityFC)?.value
      const sourceSum = this.getSourceSum(quantity, currancyValue)
      // console.log(sourceSum)
      this.oneUnitValue = this.getOneUnitValue(quantity, sourceSum)
      this.formGroup.patchValue({
        sum1: sourceSum
      })

    }

    calculateRate () {
      const sourceSum = this.getControl(this.formGroup, 'sourceSum')?.value
      const destinationSum = this.getControl(this.formGroup, 'destinationSum')?.value
      const rate = destinationSum / sourceSum
      this.formGroup.patchValue({
        rate: Number(parseFloat(String(rate)).toFixed(4))
      })
    }

    getOneUnitValue (currancy1Quantity: number, currancy2Quantity: number) {
      return currancy2Quantity / currancy1Quantity
    }

    /**
     * Комиссия 2.5%
     * Прибавляем ее к коэффициенту ценности
     */
    getValueWithCommision (data: number): number {
      const onePercent = data / 100
      const result =  data + onePercent * 2.5
      return Number(parseFloat(String(result)).toFixed(4))
    }

    /**
     * Пропорция
     */
    getSourceSum (sum2: number, sum2Value: number): number {
      return sum2 / sum2Value
    }

    roundSum1 () {
      const sum1 = this.getControl(this.formGroup, 'sum1')?.value
      if (sum1 && (typeof sum1 === 'number')) {
        this.formGroup.patchValue({
          sum1: Math.round(sum1 / 100) * 100
        })
      }
    }

    correctSum1Value () {
      const sum1 = this.getControl(this.formGroup, 'sum1')?.value
      const sum2 = this.getControl(this.formGroup, 'sum2')?.value
      if (sum1 && sum2 && (typeof sum1 === 'number') && (typeof sum2 === 'number')) {
        this.correctedSum1Value = sum2 / sum1
        this.formGroup.patchValue({
          currancy1Value: this.correctedSum1Value
        })
      }
    }

    getMoneyTransfer(id: number) {
      this.loading = true
      this.MoneyTransferServ.getMoneyTransfer(id).subscribe({
        next: (formGroupValue: any) => {
          this.loading = false
          this.formGroup.patchValue({
            id: formGroupValue.id,
            description: formGroupValue.description,
            sourceSum: formGroupValue.sourceSum,
            sourceCurrancy: formGroupValue.sourceCurrancy,
            middleTransfers: formGroupValue.middleTransfers,
            destinationSum: formGroupValue.destinationSum,
            destinationCurrancy: formGroupValue.destinationCurrancy,
            rate: formGroupValue.rate,
            date: formGroupValue.date,
            apartament_id: formGroupValue.apartament_id,
          })
        },
        error: (err: any) => {
          console.log(err)
          this.loading = false
          this.MessageServ.sendMessage('error', 'Ошибка!', err.error.message)
        }
      })
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

    update() {
      this.loading = true
      const formGroupValue = this.formGroup.value
      let data = {
        id: formGroupValue.id,
        description: formGroupValue.description,
        sourceSum: formGroupValue.sourceSum,
        sourceCurrancy: formGroupValue.sourceCurrancy,
        middleTransfers: formGroupValue.middleTransfers,
        destinationSum: formGroupValue.destinationSum,
        destinationCurrancy: formGroupValue.destinationCurrancy,
        rate: formGroupValue.rate,
        date: formGroupValue.date,
        apartament_id: formGroupValue.apartament_id,
      }
      this.MoneyTransferServ.update(data).subscribe({
        next: (res: any) => {
          this.MessageServ.sendMessage('success', 'Успешно сохранено!', 'Перевод обновлен')
          this.loading = false
          this.back()
        },
        error: (err: any) => {
          this.loading = false
          this.MessageServ.sendMessage('error', 'Ошибка!', err.error.message)
        }
      })
    }

    create () {
      this.loading = true
      const formGroupValue = this.formGroup.value
      let data = {

        description: formGroupValue.description,
        sourceSum: formGroupValue.sourceSum,
        sourceCurrancy: formGroupValue.sourceCurrancy,
        middleTransfers: formGroupValue.middleTransfers,
        destinationSum: formGroupValue.destinationSum,
        destinationCurrancy: formGroupValue.destinationCurrancy,
        rate: formGroupValue.rate,
        date: formGroupValue.date,
        apartament_id: formGroupValue.apartament_id,
      }
      this.MoneyTransferServ.create(data).subscribe({
        next: (res: any) => {
          this.MessageServ.sendMessage('success', 'Успешно сохранено!', 'Перевод добавлен')
          this.loading = false
          this.back()
        },
        error: (err: any) => {
          this.loading = false
          this.MessageServ.sendMessage('error', 'Ошибка!', err.error.message)
        }
      })
    }

    getControl(formGroup: FormGroup, formControlId: string): FormControl {
      return (formGroup.get(formControlId) as FormControl) || new FormControl(null)
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


  }
