import { Pipe, PipeTransform } from '@angular/core';
import { EExchangeRateSource } from '../../apartament-fee/apartament-fee-create/apartament-fee-create.component';
import { GetExchangeRateApiResponse } from '../../exchange-rate/types';
import { ApartamentFeeCreateApiRequest, GetFeesApiResponseItem } from '../services/apartamentFee/types';
import { LoadMoneyTransferApiResponse } from '@shared/services/moneyTransfer/types';
import { currancyCodes, CurrancyCode } from '../currancyCodes'
import { TCurrencyPipe } from './currency-value/types';
import { ECurrencyPipeResultSource, ECurrencyPipeStatus } from './currency-value/enums';
import { daysToMilliseconds, isoDateWithoutTimeZone } from '@shared/helpers';
import { CurrencyService } from '@shared/services/currency/currency.service';
export type TExchangeRateSource = typeof EExchangeRateSource[keyof typeof EExchangeRateSource]

type UnitedType<T extends LoadMoneyTransferApiResponse | GetExchangeRateApiResponse> = T extends LoadMoneyTransferApiResponse
  ? LoadMoneyTransferApiResponse
  : GetExchangeRateApiResponse

@Pipe({
  name: 'currancyValue'
})
export class CurrancyValuePipe implements PipeTransform {

  constructor (
    private CurrencyServ: CurrencyService
  ) {

  }
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

  transform(fee: GetFeesApiResponseItem, currancy: number, moneyTransfers: LoadMoneyTransferApiResponse[], exchangeRates: GetExchangeRateApiResponse[]): TCurrencyPipe {
    const stored = this.CurrencyServ.getCurrencyPipeResult(fee.id, fee.year, currancy)
    if (stored) {
      return stored
    }
    const result: TCurrencyPipe = {
      status: ECurrencyPipeStatus.DANGER,
      resultSource: ECurrencyPipeResultSource.NO_VALUE,
      currancyFrom: fee.currancy,
      currancyTo: currancy,
      description: '',
      valueFrom: fee.sum,
      valueTo: null
    }
    exchangeRates = exchangeRates.filter((el: GetExchangeRateApiResponse) => +el.currancyFrom === +currancy && +el.currancyTo === +fee.currancy)
    moneyTransfers = moneyTransfers.filter((el: LoadMoneyTransferApiResponse) => +el.sourceCurrancy === +currancy && +el.destinationCurrancy === +fee.currancy)
    if (+fee.currancy === +currancy) { // если выбрана валюта перевода
      result.status = ECurrencyPipeStatus.SUCCESS
      result.resultSource = ECurrencyPipeResultSource.CURRENCY_MATCHED
      result.valueTo = fee.sum
    } else {
      if (fee.rateId && fee.rateSource) {
        if (fee.rateSource === EExchangeRateSource.MONEY_TRANSFER_LIST) {
          const moneyTransferFound = moneyTransfers.find((el: LoadMoneyTransferApiResponse) => +el.id === fee.rateId)
          if (moneyTransferFound) {
            result.status = ECurrencyPipeStatus.SUCCESS
            result.resultSource = EExchangeRateSource.MONEY_TRANSFER_LIST
            result.description = 'Перевод присвоен'
            result.valueTo = fee.sum / moneyTransferFound.rate
          } else {
            result.status = ECurrencyPipeStatus.DANGER
            result.resultSource = EExchangeRateSource.MONEY_TRANSFER_LIST
            result.description = 'Перевод не найден'
          }
        } else if (fee.rateSource === EExchangeRateSource.EXCHANGE_RATE_LIST) {
          const exchangeRatesFound = exchangeRates.find((el: GetExchangeRateApiResponse) => +el.id === Number(fee.rateId))
          if (exchangeRatesFound) {
            result.status = ECurrencyPipeStatus.SUCCESS
            result.resultSource = EExchangeRateSource.EXCHANGE_RATE_LIST
            result.description = 'Курс валюты присвоен'
            result.valueTo = fee.sum / exchangeRatesFound.currancyFromValue
          } else {
            result.status = ECurrencyPipeStatus.DANGER
            result.resultSource = EExchangeRateSource.EXCHANGE_RATE_LIST
            result.description = 'Курс валюты не найден'
          }
        }
      } else {
        if (fee.paidDate) {
          const transferFound = moneyTransfers.find((el: LoadMoneyTransferApiResponse) => {
            return (el.sourceCurrancy === +currancy) &&
            (el.destinationCurrancy === +fee.currancy) &&
            this.isInDaysRange(fee.paidDate as string, moneyTransfers.map(el => el.date), 3, 0)
          }) // todo
          if (transferFound) {
            const getValueOfUnitRevert = (rate: number): number =>  Number(parseFloat(String(((1 * 1) / + rate))).toFixed(4)) // x = (b * c)  / a
            result.status = ECurrencyPipeStatus.SUCCESS
            result.resultSource = EExchangeRateSource.MONEY_TRANSFER_LIST
            result.description = 'Перевод был меньше 3-х дней назад'
            result.valueTo = getValueOfUnitRevert(transferFound.rate) * fee.sum
          } else {
            if (exchangeRates.length) {
              const rateRange = this.getClosestRange(exchangeRates, fee.paidDate) as { prev: GetExchangeRateApiResponse, next: GetExchangeRateApiResponse }
              result.status = ECurrencyPipeStatus.WARNING
              result.resultSource = EExchangeRateSource.EXCHANGE_RATE_LIST
              result.description = 'Средний курс валют'
              result.valueTo = fee.sum / this.average(Object.values(rateRange).map((el: GetExchangeRateApiResponse) => el.currancyFromValue))
            } else {
              if (moneyTransfers.length) {
                const transfersRange = this.getClosestRange(moneyTransfers, fee.paidDate) as { prev: LoadMoneyTransferApiResponse, next: LoadMoneyTransferApiResponse }
                result.status = ECurrencyPipeStatus.WARNING
                result.resultSource = EExchangeRateSource.MONEY_TRANSFER_LIST
                result.description = 'Средний курс переводов'
                result.valueTo = fee.sum / this.average(Object.values(transfersRange).map((el: LoadMoneyTransferApiResponse) => el.rate))
              } else {
                result.status = ECurrencyPipeStatus.DANGER
                result.resultSource = EExchangeRateSource.MONEY_TRANSFER_LIST
                result.description = 'Нет курса'
              }
            }
          }
        } else {
          result.status = ECurrencyPipeStatus.DANGER
          result.description = 'Не указана сумма платежа'
        }
      }
    }
    this.CurrencyServ.setCurrencyPipeResult(fee.id, fee.year, currancy, result)
    return result
  }

  getCurrencyCodeName (code: number): string {
    return currancyCodes.find((el: CurrancyCode) => el.code === code)?.shortName || ''
  }

  getRateSourceName (rateSource: number): string {
    return rateSource === 1 ?'Денежный перевод' : 'Курс валют'
  }

  isInDaysRange = (date: string, data: string[], daysBefore: number, daysAfter: number): boolean => {
    const t = (date: string): number => Number(isoDateWithoutTimeZone(new Date(date), 'time'))
    let result = data.find((el: string) => {
      const beforeDiff: number = t(date) - t(el)
      const afterDiff: number = t(el) - t(date)
      return (beforeDiff > 0) && (beforeDiff <= daysToMilliseconds(daysBefore)) &&  // разница нижней даты счета и даты курса д б положительная и больше в днях чем dayBefore
      (afterDiff > 0) && (afterDiff <= daysToMilliseconds(daysAfter)) // разница верхней даты курса и даты счета д б положительная и больше в днях чем dayAfter
    }) ? true : false
    return result
  }

  average = (nums: number[]) => {
    return nums.reduce((a, b) => (a + b)) / nums.length;
  }

  getClosestRange (variants: any[], currentDate: string, variantsProp: string = 'date'): { prev: any, next: any } {
    return variants.reduce((acc: any, curr: any) => {
      if (!acc.prev) {
        acc.prev = curr
      } else {
        if ((new Date(currentDate as string) >= new Date(curr[variantsProp])) && (new Date(currentDate as string) <= new Date(curr[variantsProp]))) {
          acc.prev = curr
        }
      }
      if (!acc.next) {
        acc.next = curr
      } else {
        if ((new Date(currentDate as string) <= new Date(curr[variantsProp])) && (new Date(currentDate as string) >= new Date(curr[variantsProp]))) {
          acc.next = curr
        }
      }
      return acc
    }, { prev: null, next: null })
  }
}
