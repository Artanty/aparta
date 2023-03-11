import { Pipe, PipeTransform } from '@angular/core';
import { EExchangeRateSource } from '../../apartament-fee/apartament-fee-create/apartament-fee-create.component';
import { GetExchangeRateApiResponse } from '../../exchange-rate/types';
import { GetFeesApiResponseItem } from '../services/apartamentFee/types';
import { LoadMoneyTransferApiResponse } from '../services/moneyTransfer/money-transfer.service';

@Pipe({
  name: 'currancyValue'
})
export class CurrancyValuePipe implements PipeTransform {

  transform(fee: GetFeesApiResponseItem, currancy: number, moneyTransfers: LoadMoneyTransferApiResponse[], exchangeRates: GetExchangeRateApiResponse[]): number | null {
    if (fee.currancy === +currancy) { // если выбрана валюта перевода
      return fee.sum
    }
    if (fee.rateId && fee.rateSource) {
      if (fee.rateSource === EExchangeRateSource.MONEY_TRANSFER_LIST) {
        const moneyTransferFound = moneyTransfers.find((el: LoadMoneyTransferApiResponse) => {
          /**
           * Если перевели из рублей в динары, смотрим в рублях
           */
          return +el.id === fee.rateId && +el.sourceCurrancy === +currancy && +el.destinationCurrancy === +fee.currancy
        })
        if (moneyTransferFound) {
          console.log(moneyTransferFound)
          return fee.sum / moneyTransferFound.rate
        }
      } else if (fee.rateSource === EExchangeRateSource.EXCHANGE_RATE_LIST) {
        const exchangeRatesFound = exchangeRates.find((el: GetExchangeRateApiResponse) => {
          el.id === fee.rateId && +el.currancyFrom === +currancy && +el.currancyTo === +fee.currancy
        })
        if (exchangeRatesFound) {
          return fee.sum / exchangeRatesFound.currancyFromValue
        }
      }
    } else {
      //
    }
    return null
  }

  // return +el.id === Number(fee.rateId) && el.currancyFrom === currancy && el.currancyTo === fee.currancy

}
