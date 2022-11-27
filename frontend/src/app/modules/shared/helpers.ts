export const orderBy = (data: any, key: any, order: any, format?: Function) => {
  data.sort((a: any, b: any) => {
    if (format) {
      const aFormatted = format(a)
      const bFormatted = format(b)
      if (aFormatted < bFormatted) {
        return order === 'asc' ? 1 : -1
      }
      if (aFormatted > bFormatted) {
        return order === 'desc' ? 1 : -1
      }
      return 0
    } else {
      if (a[key] < b[key]) {
        return order === 'asc' ? 1 : -1
      }
      if (a[key] > b[key]) {
        return order === 'desc' ? 1 : -1
      }
      return 0
    }

  })
  return JSON.parse(JSON.stringify(data))
}

export const prependZero = (data: string | number) => {
  if (data && String(data).length === 1) {
    data = '0' + data
  }
  return data
}

export const removeDuplicatedObj = (array: any, prop: string) => {
  return Array.from(new Set(array.map((a: any) => a[prop])))
    .map(value => {
      return array.find((a: any) => a[prop] === value)
    })
}
