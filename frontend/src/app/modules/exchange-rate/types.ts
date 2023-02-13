export type GetExchangeRateApiResponse = {
  "id": number
  "date": string
  "currancyFrom": number
  "currancyTo": number
  "currancyFromValue": number
  "source": string
  "created_at": string
  "updated_at": string
}

export type CreateExchangeRateApiRequest = {
  "date": string
  "currancyFrom": number
  "currancyTo": number
  "currancyFromValue": number
}
