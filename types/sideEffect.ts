import { ApiResponse } from "./api";

export interface CreateSideEffectRequest {
  id: string;
  drug_name: string;
  description: string;
}

export interface UpdateSideEffectRequest {
  sideEffectId: string;
  description: string;
}

export interface DeleteSideEffectRequest {
  sideEffectId: string;
}

export interface sideEffectItem {
  id: string;
  drug_name: string;
  description: string;
}

export interface GetSideEffectResult {
  sideEffectList: sideEffectItem[];
}

export interface GetSideEffectMedicineResult {
  id: string;
  name: string;
  startAt: string;
  endAt: string;
}

export type SideEffectResponse = ApiResponse<{}>;
export type GetSideEffectResponse = ApiResponse<GetSideEffectResult>;
export type GetSideEffectMedicineResponse =
  ApiResponse<GetSideEffectMedicineResult>;
