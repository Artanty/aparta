export type CreateMoneyTransferApiResponse = {
  apartament_id?: number;
  created_at: string;
  creator_id: number;
  date: string;
  description: string | null;
  destinationCurrancy: number;
  destinationSum: number;
  id: number;
  middleTransfers: string;
  name: string | null;
  rate: number;
  sourceCurrancy: number;
  sourceSum: number;
  updated_at: string;
};


export type CreateMoneyTransferApiRequest = {
  name?: string | null | any;
  description: string | null;
  sourceSum: number;
  sourceCurrancy: number;
  middleTransfers: string;
  destinationSum: number;
  destinationCurrancy: number;
  rate: number;
  date: string;
  apartament_id: number;
}

export type LoadMoneyTransferApiResponse = {
  id: number;
  name: string | null;
  description: string | null;
  sourceCurrancy: number;
  sourceSum: number;
  currancy2: number | null;
  sum2: number | null;
  destinationCurrancy: number;
  destinationSum: number;
  date: string;
  apartament_id: number;
  creator_id: number;
  created_at: string;
  updated_at: string;
  currancy1Value: number | null;
  middleTransfers: any | null;
  rate: number;
}
