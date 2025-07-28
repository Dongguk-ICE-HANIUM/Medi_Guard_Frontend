export enum TakingType {
  DAILY = "DAILY",
  SPECIFIC_INTERVAL = "SPECIFIC_INTERVAL",
  SPECIFIC_DAY = "SPECIPIC_DAY",
  SPECIFIC_DATE = "SPECIPIC_DATE",
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
  amout: number;
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
