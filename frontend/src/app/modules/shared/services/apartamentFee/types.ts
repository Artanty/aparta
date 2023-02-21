export type GetFeesApiResponseItem = {
  "id": number
  "name": string
  "description": null | string,
  "currancy": number
  "sum": number
  "month": number
  "year": number
  "paid": any
  "paidDate": null | string
  "template_id": number
  "apartament_id": number | string
  "creator_id": number
  "created_at": string
  "updated_at": string
  "apartament"?: Apartament
  rateId: number | null
  rateSource: number | null
}

export type ApartamentFeeCreateApiRequest = {
  "name": string
  "description": null | string,
  "sum": number
  "currancy": null | number
  "month": number
  "year": number
  "paid": boolean
  "template_id": number | null
  "apartament_id": number | string
  "paidDate": null | string
  rateId: number | null
  rateSource: number | null
}

export type ApartamentFeeCreateApiResponse = {
  "name": string
  "description": null | string,
  "sum": number
  "currancy": any
  "month": number
  "year": number
  "paid": true,
  "paidDate": null | string
  "apartament_id": number | string
  "template_id": any
  "creator_id": number
  "updated_at": string
  "created_at": string
  "id": number
  "apartament"?: Apartament
  rateId: number | null
  rateSource: number | null
}

type Apartament = {
  "id": number
  "name": string
  "address": string
  "country": string
  "place": string
  "location": any
  "description": any
  "rentType": number
  "area": any
  "rooms": number
  "garage": any
  "creator_id": number
  "created_at": string
  "updated_at": string
}

export type UpdateFeeApiReqest = {
  "id": number
  "name": string
  "description": null | string,
  "currancy": number
  "sum": number
  "month": number
  "year": number
  "paid": any
  "paidDate": null | string
  "template_id": number
  "apartament_id": number | string
  rateId: number | null
  rateSource: number | null
}
