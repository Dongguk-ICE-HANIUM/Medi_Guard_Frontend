import { ApiResponse } from "./api";

export enum TakingType {
  UNSELECTED = "UNSELECTED", //null 허용안하기 위해서 추가
  DAILY = "DAILY",
  SPECIFIC_INTERVAL = "SPECIFIC_INTERVAL",
  SPECIFIC_DAY = "SPECIFIC_DAY",
  SPECIFIC_DATE = "SPECIFIC_DATE",
  NEED = "NEED",
}

// API로 받아오는 약물 기본 정보
export interface MedicineInfo {
  id: string;
  name: string;
  code: string;
  effect: string;
  warning: string;
  sideEffect: string;
  interaction: string;
  deposit_method: string;
}

// 사용자가 등록하는 복용 정보
export interface Medication {
  id: string;
  medicineInfo: MedicineInfo; // API에서 가져온 약물 정보 (필수)
  startAt: string;
  endAt: string;
  takingType: TakingType;
  interval: number;
  particularDate: string[];
  perDay: number;
  amount: number;
  isActive: boolean;
  groupName: string;
  groupId?: string; // 그룹 ID (선택적)
  notifiTakingList: {
    id: string;
    time: string;
  }[];
}

export interface MedicationResponse<T> {
  errorCode: string;
  message: string;
  result: T | null;
}

export interface DrugGroup {
  id: string;
  name: string;
}

export interface Drug {
  id: string;
  calendarDrugId: string;
  name: string;
  startDate: string;
  endDate: string;
  timeSlot: number;
  takenDaysCount: number;
  missedDaysCount: number;
}

export interface DrugGroupResult {
  drugGroupList: DrugGroup[];
}

export type DrugGroupResponse = ApiResponse<DrugGroupResult>;

export interface DrugResult {
  drugList: Drug[];
}

export type DrugResponse = ApiResponse<DrugResult>;

export interface ApiErrorResponse {
  errorCode: string;
  message: string;
  result: null;
}

export interface NotifiTaking {
  time: string;
  isActive: boolean;
}

export interface NotifiTakingResult {
  NotifiTakingList: NotifiTaking[];
}

export type NotifiTakingResponse = ApiResponse<NotifiTakingResult>;

// 디테일 페이지용 약물 정보
export interface DrugDetail {
  id: string;
  name: string;
  code: string;
  effect: string;
  warning: string;
  sideEffect: string;
  interaction: string;
  deposit_method: string;
  startAt: string;
  endAt: string;
  takingType: TakingType;
  perDay: number;
  amount: number;
  notifiTakingList: {
    id: string;
    time: string;
  }[];
  isActive: boolean;
  groupName: string;
  groupId?: string;
}

export type DrugDetailResponse = ApiResponse<DrugDetail>;
