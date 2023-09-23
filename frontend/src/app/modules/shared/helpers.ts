import { currancyCodes } from "./currancyCodes"

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



export function throttle (func: Function, ms: number) {

  let isThrottled: boolean = false
  let savedArgs: any
  let savedThis: any

  function wrapper(this: any, ...args: any) {

    if (isThrottled) { // (2)
      savedArgs = args;
      savedThis = this;
      return;
    }
    isThrottled = true;

    func.apply(this, args); // (1)

    setTimeout(function() {
      isThrottled = false; // (3)
      // if (savedArgs) {
      //   console.log(savedArgs)
      //   wrapper.apply(savedThis, savedArgs);
      //   savedArgs = savedThis = null;
      // }
    }, ms);
  }
  return wrapper;
}


export const daysToMilliseconds = (days: number): number => {
  return days * 24 * 60 * 60 * 1000;
}

export const monthOptions = [
  { id: "1", name: "Январь" },
  { id: "2", name: "Февраль" },
  { id: "3", name: "Март" },
  { id: "4", name: "Апрель" },
  { id: "5", name: "Май" },
  { id: "6", name: "Июнь" },
  { id: "7", name: "Июль" },
  { id: "8", name: "Август" },
  { id: "9", name: "Сентябрь" },
  { id: "10", name: "Октябрь" },
  { id: "11", name: "Ноябрь" },
  { id: "12", name: "Декабрь" }
]

export const getYearOptions = (): { name: string, id: string }[] => {
  const nowYear = new Date().getFullYear()
  const yearOptions = [] as any
  for (let i = 2019; i <= nowYear + 1; i++) {
    yearOptions.push({ name: String(i), id: String(i) })
  }
  return yearOptions
}

export const getCurrancyOptions = (nameProp: string = 'sign', slice: number = 4) => {
  if (Array.isArray(currancyCodes)) {
    return currancyCodes.slice(0, slice).map((el: {
      shortName: string
      code: number
      name: string
      sign?: string
    }) => {
      if (nameProp === 'shortName') {
        return { name: el.shortName, id: el.code }
      } else if (nameProp === 'name') {
        return { name: el.name, id: el.code }
      } else {
        return { name: el.sign || el.shortName, id: el.code }
      }
    })
  }
  return []
}
