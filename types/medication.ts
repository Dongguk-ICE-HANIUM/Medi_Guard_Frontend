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

export interface DrugGroupResponse {
  errorCode: string | null;
  message: string;
  result: {
    drugGroupList: DrugGroup[];
  };
}

export interface DrugResponse {
  errorCode: string | null;
  message: string;
  result: {
    drugList: Drug[];
  };
}

export interface ApiErrorResponse {
  errorCode: string;
  message: string;
  result: null;
}

export interface NotifiTaking {
  time: string;
  isActive: boolean;
}

export interface NotifiTakingResponse {
  errorCode: string;
  message: string;
  result: {
    NotifiTakingList: NotifiTaking[];
  };
}

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
}

export interface DrugDetailResponse {
  errorCode: string | null;
  message: string;
  result: DrugDetail;
}
