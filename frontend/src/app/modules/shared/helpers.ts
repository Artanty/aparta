export const orderBy = (data: any, key: string | Function, order: any) => {
  const formatFunc = (val: any) => {
    return typeof key === 'function' ? key(val) : val[key]
  }
  data.sort((a: any, b: any) => {
    if (formatFunc(a) < formatFunc(b)) {
      return order === 'asc' ? 1 : -1
    }
    if (formatFunc(a) > formatFunc(b)) {
      return order === 'desc' ? 1 : -1
    }
    return 0
  })
  return data
}

export const prependZero = (data: string | number) => {
  if (data && String(data).length === 1) {
    data = '0' + data
  }
  return data
}

export const removeDuplicatedObj = (array: any, prop: string) => {
  if (Array.isArray(array)) {
    return Array.from(new Set(array.map((a: any) => a[prop])))
      .map(value => {
        return array.find((a: any) => a[prop] === value)
      })
  } else {
    return array
  }
}

export function isNonNull<T>(value: T): value is NonNullable<T> {
  return value != null;
}

export function isoDateWithoutTimeZone(date: Date, format: string = 'ISOString'): string {
    if (date == null) return date;
    var timestamp = date.getTime() - date.getTimezoneOffset() * 60000;
    var correctDate = new Date(timestamp);
    correctDate.setUTCHours(0, 0, 0, 0); // uncomment this if you want to remove the time
    return format === 'ISOString' ? correctDate.toISOString() : correctDate.getTime().toString()
  }

export function isMock(): boolean {
  let localStorageItem: string | null | boolean = localStorage.getItem('mock')
  if (localStorageItem) {
    localStorageItem = Boolean(Number(localStorageItem))
  }
  return !!localStorageItem
}

export function setMock(value: boolean): void {
  return localStorage.setItem('mock', String(Number(value)))
}

// millisecondsToDays(ms: number): number {
//   return Math.floor(ms / (24*60*60*1000))
// }

// explainRate (fee: ApartamentFeeCreateApiRequest, rate: UnitedType<LoadMoneyTransferApiResponse & GetExchangeRateApiResponse>, source: TExchangeRateSource) {
  //   if (source === EExchangeRateSource.MONEY_TRANSFER_LIST) {
  //     const currentRate: LoadMoneyTransferApiResponse = rate
  //     console.log('Тип курса: перевод')
  //     console.log('Курс из ' + this.getCurrencyCodeName(currentRate.sourceCurrancy) + ' в ' + this.getCurrencyCodeName(currentRate.destinationCurrancy))
  //     console.log('1 ' + this.getCurrencyCodeName(currentRate.sourceCurrancy) + ' = ' + this.getValueOfUnit(currentRate.rate) + ' ' + this.getCurrencyCodeName(currentRate.destinationCurrancy))
  //     console.log('1 ' + this.getCurrencyCodeName(currentRate.destinationCurrancy) + ' = ' + this.getValueOfUnitRevert(currentRate.rate) + ' ' + this.getCurrencyCodeName(currentRate.sourceCurrancy))
  //     console.log(fee.sum + ' ' + this.getCurrencyCodeName(fee.currancy) + ' будет ' + (this.getValueOfUnitRevert(currentRate.rate) * fee.sum) + ' ' + this.getCurrencyCodeName(currentRate.sourceCurrancy))
  //   }
  // }

  // getValueOfUnit = (rate: number): number => Number(parseFloat(String(rate)).toFixed(4))


  // throttle (fn: Function) {
  //   let memory: Set<number> = new Set()
  //   return function (executionId: number, ...args: any[]) {
  //     if (memory.has(executionId)) {
  //       return
  //     } else {
  //       if (Array.isArray(args[0])) {
  //         if (args[0].length) {
  //           memory.add(executionId)
  //           fn(...args)
  //         }
  //       } else {
  //         memory.add(executionId)
  //         fn(...args)
  //       }
  //     }
  //   }
  // }
  // c1 = this.throttle(this.consoleLog.bind(this))


  export const daysToMilliseconds = (days: number): number => {
    return days * 24 * 60 * 60 * 1000;
  }
