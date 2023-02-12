export type FeeTemplateApiResponseItem = {
  "id": number
  "name": string
  "description": string | null,
  "currancy": number
  "sum": number
  "month": number
  "year": number
  "organizationTariff_id": number
  "organization_id": number
  "apartament_id": number
  "payVariant": number
  "creator_id": number
  "created_at": string
  "updated_at": string
}

export type FeeTemplateUpdateApiRequest = {
  "name": string
  "apartament_id": number
  "description": string
  "sum": number
  "currancy": number
  "id": number
}
