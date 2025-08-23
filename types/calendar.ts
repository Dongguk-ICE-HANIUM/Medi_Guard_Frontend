import { ApiResponse } from "./api";

export interface DayData {
  didTakePill: boolean;
  hasSideEffect: boolean;
  isTakeScheduled: boolean;
  isScheduled: boolean;
}

export interface CalendarResult {
  dateList: DayData[];
}

export type CalendarResponse = ApiResponse<CalendarResult>;
