import { Pipe, PipeTransform } from '@angular/core';
import { CurrancyCode, currancyCodes } from '@shared/currancyCodes'

@Pipe({
  name: 'currencyOnly'
})
export class CurrencyOnlyPipe implements PipeTransform {

  transform(currancy: number | undefined, prop: string = 'sign'): string {
    if (currancy) {
      const found: any = currancyCodes.find((el: CurrancyCode) => {
        return el.code === currancy
      })
      return found?.[prop as any] || found?.shortName || ''
    }
    return ''
  }
}
