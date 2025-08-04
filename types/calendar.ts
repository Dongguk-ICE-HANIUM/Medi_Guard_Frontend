export interface DayData {
  didTakePill: boolean;
  hasSideEffect: boolean;
  isTakeScheduled: boolean;
  isScheduled: boolean;
}

export interface CalendarResponse {
  errorCode: string | null;
  message: string;
  result: {
    dateList: DayData[];
  };
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
