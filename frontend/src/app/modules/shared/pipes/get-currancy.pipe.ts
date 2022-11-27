import { Pipe, PipeTransform } from '@angular/core';
import { E } from 'chart.js/dist/chunks/helpers.core';
import { currancyCodes } from './../../shared/currancyCodes';
import { exchangeRates } from './../../shared/exchangeRates';

type Convert = 'to__840' | 'to__978' | 'to__941' | 'to__643'

@Pipe({
  name: 'getCurrancy'
})
export class GetCurrancyPipe implements PipeTransform {

  transform(itemObj: any, codeProp = 'currancy', valueProp?: string, convert?: number): string | number {
    let result: string | number = ''
    if (!convert) {
      if (itemObj[codeProp] && typeof itemObj[codeProp] === 'number') {
        result = currancyCodes.find((el: any) => {
          return el.code === itemObj[codeProp]
        })?.shortName || ''
      }
    } else if (convert && valueProp) {
      const rate = (exchangeRates).find((el: any) => {
        return el.code === itemObj[codeProp]
      })?.[('to__' + String(convert) as Convert)]
      if (rate) {
        result = rate * itemObj[valueProp]
      }
    }
    return result
  }

}
