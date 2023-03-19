import { Pipe, PipeTransform } from '@angular/core';
import { EExchangeRateSource } from '../../apartament-fee/apartament-fee-create/apartament-fee-create.component';
import { GetExchangeRateApiResponse } from '../../exchange-rate/types';
import { ApartamentFeeCreateApiRequest, GetFeesApiResponseItem } from '../services/apartamentFee/types';
import { LoadMoneyTransferApiResponse } from '../services/moneyTransfer/money-transfer.service';
import { currancyCodes, CurrancyCode } from '../currancyCodes'
export type TExchangeRateSource = typeof EExchangeRateSource[keyof typeof EExchangeRateSource]

type UnitedType<T extends LoadMoneyTransferApiResponse | GetExchangeRateApiResponse> = T extends LoadMoneyTransferApiResponse
  ? LoadMoneyTransferApiResponse
  : GetExchangeRateApiResponse


@Pipe({
  name: 'currancyValue'
})
export class CurrancyValuePipe implements PipeTransform {
  /**
   *
   * @param fee
   * @param currancy выбранная валюта, в которой в результате нужно показать сумму (643 - рубли)
   * @param moneyTransfers денежные переводы - сразу проверить, есть ли хотя бы один,
   * он будет использован, если нет курсов валют.
   * Если к записи не прикреплен денежный перевод, то ищем перевод в течение недели из в эту валюту:
   * кейс 1.
   * переводили рубли в евро.
   * не привязали перевод.
   * сейчас надо вывести в рублях, сколько оплачено в евро.
   * 1. Если у записи есть источник курса rateSource
   * 1.1 Ишем по источнику и id запись в переводах или курсах
   * 2. Если нет:
   * ищем этот перевод из рублей в евро, инвертируем курс и вычисляем
   * @param exchangeRates
   * @returns
   */
  getCurrencyCodeName (code: number): string {
    return currancyCodes.find((el: CurrancyCode) => el.code === code)?.shortName || ''
  }
  getRateSourceName (rateSource: number): string {
    return rateSource === 1 ?'Денежный перевод' : 'Курс валют'
  }
  consoleLog = (log: string) => console.log(log)
  throttle (fn: Function) {
    let memory: Set<number> = new Set()
    return function (executionId: number, ...args: any[]) {
      if (memory.has(executionId)) {
        return
      } else {
        if (Array.isArray(args[0])) {
          if (args[0].length) {
            memory.add(executionId)
            fn(...args)
          }
        } else {
          memory.add(executionId)
          fn(...args)
        }
      }
    }
  }
  c1 = this.throttle(this.consoleLog.bind(this))

  getValueOfUnit = (rate: number): number => Number(parseFloat(String(rate)).toFixed(4))
    /**
     * x = (b * c)  / a
     */
  getValueOfUnitRevert = (rate: number): number =>  Number(parseFloat(String(((1 * 1) / + rate))).toFixed(4))
  t = (date: string): number => Number(this.isoDateWithoutTimeZone(new Date(date), 'time'))
  t2 = (date: string): string => this.isoDateWithoutTimeZone(new Date(date)).slice(0, 10)
  isInDaysRange = (date: string, data: string[], daysBefore: number, daysAfter: number): boolean => {
    let result = data.find((el: string) => {
      const beforeDiff: number = this.t(date) - this.t(el)
      const afterDiff: number = this.t(el) - this.t(date)
      return (beforeDiff > 0) && (beforeDiff <= this.daysToMilliseconds(daysBefore)) &&  // разница нижней даты счета и даты курса д б положительная и больше в днях чем dayBefore
      (afterDiff > 0) && (afterDiff <= this.daysToMilliseconds(daysAfter)) // разница верхней даты курса и даты счета д б положительная и больше в днях чем dayAfter
    }) ? true : false
   console.log(result)
    return result
  }
  transform(fee: ApartamentFeeCreateApiRequest, currancy: number, moneyTransfers: LoadMoneyTransferApiResponse[], exchangeRates: GetExchangeRateApiResponse[]): number | null {
    const c1 = this.c1
    const c = console.log
    if (fee.currancy === +currancy) { // если выбрана валюта перевода
      return fee.sum
    }
    c1(99, fee)
    c1(4, 'Нужно отобразить в: ' + this.getCurrencyCodeName(currancy))
    c1(1, moneyTransfers)
    c1(5, 'Нужно перевод из: ' + this.getCurrencyCodeName(fee.currancy))
    c1(2, exchangeRates)
    c1(6, 'Источник курса валюты: ' + (fee.rateSource ? this.getRateSourceName(fee.rateSource) : 'Нет.'))
    if (fee.rateId && fee.rateSource) {
      if (fee.rateSource === EExchangeRateSource.MONEY_TRANSFER_LIST) {
        const moneyTransferFound = moneyTransfers.find((el: LoadMoneyTransferApiResponse) => {
          /**
           * Если перевели из рублей в динары, смотрим в рублях
           */
          return +el.id === fee.rateId && +el.sourceCurrancy === +currancy && +el.destinationCurrancy === +fee.currancy
        })
        if (moneyTransferFound) {
          c('Привязанный к записи перевод найден: ' + moneyTransferFound)
          return fee.sum / moneyTransferFound.rate
        }
      } else if (fee.rateSource === EExchangeRateSource.EXCHANGE_RATE_LIST) {
        const exchangeRatesFound = exchangeRates.find((el: GetExchangeRateApiResponse) => {
          el.id === fee.rateId && +el.currancyFrom === +currancy && +el.currancyTo === +fee.currancy
        })
        if (exchangeRatesFound) {
          console.log('Привязанный к записи курс валюты найден: ' + exchangeRatesFound)
          return fee.sum / exchangeRatesFound.currancyFromValue
        }
      }
    } else {
      if (fee.paidDate) {
        c1(7, 'Нет привязанного к платежу курса, есть дата платежа, ищем перевод из '
        + this.getCurrencyCodeName(currancy) + ' в ' + this.getCurrencyCodeName(fee.currancy) +
        ' c ' + this.t2(fee.paidDate) + ' по ' + this.addDays(this.t2(fee.paidDate), -3) + '...')
        const transferFound = moneyTransfers.find((el: LoadMoneyTransferApiResponse) => {
          return (el.sourceCurrancy === +currancy) &&
          (el.destinationCurrancy === +fee.currancy) &&
          this.isInDaysRange(fee.paidDate as string, moneyTransfers.map(el => el.date), 3, 0)
        })
        if (transferFound) {
          c1(98, 'Перевод найден')
          console.log(transferFound)
          // c('сумма в ' + this.getCurrencyCodeName(fee.currancy) + ': ' + fee.sum)
          // console.log(fee.sum + ' ' + this.getCurrencyCodeName(fee.currancy) + ' будет ' + (this.getValueOfUnitRevert(transferFound.rate) * fee.sum) + ' ' + this.getCurrencyCodeName(transferFound.sourceCurrancy))
          // this.explainRate(fee, transferFound, EExchangeRateSource.MONEY_TRANSFER_LIST)
          // c('Курс - 1 ' + this.getCurrencyCodeName(transferFound.) + ' = ' + fee.sum + ' ' + this.getCurrencyCodeName(currancy))
         return this.getValueOfUnitRevert(transferFound.rate) * fee.sum
        } else {
          console.log('Перевод не найден, ищем среднее значение среди курсов валют')
          /**
           * Взять две ближайшие к платежу даты снизу и сверху из курсов валют
           */
        }
      }
    }
    return null
  }


  //
  explainRate (fee: ApartamentFeeCreateApiRequest, rate: UnitedType<LoadMoneyTransferApiResponse & GetExchangeRateApiResponse>, source: TExchangeRateSource) {


    // const countReverted = ()
    if (source === EExchangeRateSource.MONEY_TRANSFER_LIST) {
      const currentRate: LoadMoneyTransferApiResponse = rate
      // const currentRateValue =
      console.log('Тип курса: перевод')
      console.log('Курс из ' + this.getCurrencyCodeName(currentRate.sourceCurrancy) + ' в ' + this.getCurrencyCodeName(currentRate.destinationCurrancy))
      console.log('1 ' + this.getCurrencyCodeName(currentRate.sourceCurrancy) + ' = ' + this.getValueOfUnit(currentRate.rate) + ' ' + this.getCurrencyCodeName(currentRate.destinationCurrancy))
      console.log('1 ' + this.getCurrencyCodeName(currentRate.destinationCurrancy) + ' = ' + this.getValueOfUnitRevert(currentRate.rate) + ' ' + this.getCurrencyCodeName(currentRate.sourceCurrancy))
      console.log(fee.sum + ' ' + this.getCurrencyCodeName(fee.currancy) + ' будет ' + (this.getValueOfUnitRevert(currentRate.rate) * fee.sum) + ' ' + this.getCurrencyCodeName(currentRate.sourceCurrancy))
    }
    console.log(rate)
    console.log(source)
  }

  // return +el.id === Number(fee.rateId) && el.currancyFrom === currancy && el.currancyTo === fee.currancy
  isoDateWithoutTimeZone(date: Date, format: string = 'ISOString'): string {
    if (date == null) return date;
    var timestamp = date.getTime() - date.getTimezoneOffset() * 60000;
    var correctDate = new Date(timestamp);
    correctDate.setUTCHours(0, 0, 0, 0); // uncomment this if you want to remove the time
    return format === 'ISOString' ? correctDate.toISOString() : correctDate.getTime().toString()
  }

  daysToMilliseconds(days: number): number {
    return days * 24 * 60 * 60 * 1000;
  }
  millisecondsToDays(ms: number): number {
    return Math.floor(ms / (24*60*60*1000))
  }
  addDays(date: string, days: number): string {
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
    return this.isoDateWithoutTimeZone(result).slice(0, 10)
  }
  getOneUnitValue (currancy1Quantity: number, currancy2Quantity: number) {
    return currancy2Quantity / currancy1Quantity
  }
}
