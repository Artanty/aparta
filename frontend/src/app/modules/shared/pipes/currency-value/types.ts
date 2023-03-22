import { EExchangeRateSource } from "@app/modules/apartament-fee/apartament-fee-create/apartament-fee-create.component"
import { ECurrencyPipeStatus, ECurrencyPipeResultSource } from "./enums"

export type TCurrencyPipe = {
  status: typeof ECurrencyPipeStatus[keyof typeof ECurrencyPipeStatus],
  description: string,
  currancyFrom: number,
  currancyTo: number,
  valueFrom: number | null,
  valueTo: number | null,
  resultSource: typeof ECurrencyPipeResultSource[keyof typeof ECurrencyPipeResultSource] |
  typeof EExchangeRateSource[keyof typeof EExchangeRateSource]
}
