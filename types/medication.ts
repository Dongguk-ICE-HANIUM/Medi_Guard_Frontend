export enum TakingType {
  UNSELECTED = "UNSELECTED", //null 허용안하기 위해서 추가
  DAILY = "DAILY",
  SPECIFIC_INTERVAL = "SPECIFIC_INTERVAL",
  SPECIFIC_DAY = "SPECIFIC_DAY",
  SPECIFIC_DATE = "SPECIFIC_DATE",
  NEED = "NEED",
}

//등록용
export interface Medication {
  id: string;
  name: string;
  startAt: string;
  endAt: string;
  takingType: TakingType;
  interval: number;
  particularDate: string[];
  perDay: number;
  amount: number;
  isActive: boolean;
  groupName: string;
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

//이전 페이지에서 받아오는 약물 정보
export interface SelectedMedicineInfo {
  id: string;
  name: string;
}
