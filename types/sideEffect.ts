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

export interface GetSideEffectResult {
  id: string;
  drug_name: string;
  description: string;
}

export type SideEffectResponse = ApiResponse<{}>;
export type GetSideEffectResponse = ApiResponse<GetSideEffectResult[]>;
