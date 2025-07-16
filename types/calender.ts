export interface DayData {
  didTakePill: boolean;
  hasSideEffect: boolean;
  isTakeScheduled: boolean;
  isScheduled: boolean;
}

export interface CalenderResponse {
  errorCode: string | null;
  message: string;
  result: {
    dataList: DayData[];
  };
}

export interface ApiErrorResponse {
  errorCode: string;
  message: string;
  result: null;
}
