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

export function isoDateWithoutTimeZone (date: Date): string {
  if (date == null) return date;
  var timestamp = date.getTime() - date.getTimezoneOffset() * 60000;
  var correctDate = new Date(timestamp);
  correctDate.setUTCHours(0, 0, 0, 0); // uncomment this if you want to remove the time
  return correctDate.toISOString().slice(0, 10)
}
