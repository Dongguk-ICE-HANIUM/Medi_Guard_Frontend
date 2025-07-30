export enum TakingType {
  DAILY = "DAILY",
  SPECIFIC_INTERVAL = "SPECIFIC_INTERVAL",
  SPECIFIC_DAY = "SPECIFIC_DAY",
  SPECIFIC_DATE = "SPECIFIC_DATE",
  NEED = "NEED",
}
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
