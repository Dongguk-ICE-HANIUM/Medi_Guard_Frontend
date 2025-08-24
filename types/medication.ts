import { ApiResponse } from "./api";

export enum TakingType {
  UNSELECTED = "UNSELECTED",
  EVERY_DAY = "EVERY_DAY",
  PARTICULAR_INTERVAL = "PARTICULAR_INTERVAL",
  PARTICULAR_DAY = "PARTICULAR_DAY",
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
  depositMethod: string;
}

// 약물데이터 상세
export interface Medication {
  id: string;
  medicineInfo: MedicineInfo; // API에서 가져온 약물 정보
  startAt: string;
  endAt: string;
  takingType: TakingType;
  interval?: number;
  specificDateList?: string[];
  perDay: number;
  amount: number;
  isActive: boolean;
  isEssential: boolean;
  groupName?: string;
  groupId?: string;
  notifiTakingList: Array<{
    id: string;
    time: string;
    isActive?: boolean;
  }>;
  // 복용 완료 상태 관리 (날짜별로 저장)
  takenDates?: Record<string, number>; // 날짜: timeSlot (이진수)
}

export type DrugDetailResponse = ApiResponse<Medication>;

//약물 그룹 정보
export interface DrugGroup {
  id: string;
  name: string;
}
export interface DrugGroupResult {
  drugGroupList: DrugGroup[];
}

export type DrugGroupResponse = ApiResponse<DrugGroupResult>;

//달력용 복용 정보
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

export interface DrugResult {
  drugList: Drug[];
}

export type DrugResponse = ApiResponse<DrugResult>;

//복용 알림
export interface NotifiTaking {
  time: string;
  isActive: boolean;
}

export interface NotifiTakingResult {
  NotifiTakingList: NotifiTaking[];
}

export type NotifiTakingResponse = ApiResponse<NotifiTakingResult>;

//api용
//post. 약물 등록
export type CreateMedicationRequest = Pick<
  Medication,
  | "startAt"
  | "endAt"
  | "takingType"
  | "perDay"
  | "amount"
  | "groupId"
  | "interval"
  | "specificDateList"
> & {
  drugId: string;
  name: string;
};

export type CreateMedicationResponse = ApiResponse<Medication>;

//patch. 약물 수정 요청
export type UpdateMedicationRequest = Partial<
  Omit<Medication, "id" | "medicineInfo">
>;

export type UpdateMedicationResponse = ApiResponse<Medication>;
