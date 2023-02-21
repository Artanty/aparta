export type GetFeesApiResponseItem = {
  "id": number
  "name": string
  "description": null | string,
  "currancy": number
  "sum": string | number
  "commission": any
  "month": number
  "year": number
  "paid": any
  "paidDate": null | string
  "organization_id": number
  "organizationTariff_id": number
  "template_id": number
  "apartament_id": number | string
  "payVariant": number
  "creator_id": number
  "created_at": string
  "updated_at": string
  "apartament"?: Apartament
  rateId: number | null
  rateSource: number | null
}

export type ApartamentFeeCreateApiRequest = {
  "name": string
  "description": string
  "sum": string
  "currancy": null | number
  "month": number
  "year": number
  "paid": boolean
  "template_id": number | null
  "apartament_id": number | string
  "paidDate": string
  rateId: number | null
  rateSource: number | null
}

export type ApartamentFeeCreateApiResponse = {
  "name": string
  "description": string
  "sum": string
  "commission": any
  "currancy": any
  "month": number
  "year": number
  "paid": true,
  "paidDate": string
  "payVariant": any
  "organization_id": any
  "organizationTariff_id": any
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
