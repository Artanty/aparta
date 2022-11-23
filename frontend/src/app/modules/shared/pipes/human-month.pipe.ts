import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'humanMonth'
})
export class HumanMonthPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return this.getMonthName(value)
  }

  getMonthName(monthNumber: any) {
    if (monthNumber && typeof monthNumber === 'number') {
      const date = new Date()
      date.setMonth(monthNumber - 1)
      return date.toLocaleString('ru-RU', { month: 'long' })
    }
    return monthNumber
  }
}
