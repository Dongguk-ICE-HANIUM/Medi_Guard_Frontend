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
