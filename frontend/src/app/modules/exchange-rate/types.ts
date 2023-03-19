export type GetExchangeRateApiResponse = {
  "id": number
  "date": string
  "currancyFrom": number
  "currancyTo": number
  "currancyFromValue": number
  "source": number
  "created_at": string
  "updated_at": string
  _dateCurFromCurTo: number
}

export type CreateExchangeRateApiRequest = {
  "date": string
  "currancyFrom": number
  "currancyTo": number
  "currancyFromValue": number
  _dateCurFromCurTo: number
  source: number
}
