import { ApiResponse } from "./api";

//진료 기본 정보
export interface AppointmentBase {
  scheduleId: number;
  doctorName: string;
  hospitalName: string;
}

export interface NextAppointment extends AppointmentBase {
  time: string;
  isToday: boolean;
}

export type NextAppointmentResponse = ApiResponse<NextAppointment>;

//진료 이력 아이템
export interface AppointmentHistoryItem extends AppointmentBase {
  datetime: string;
}

//진료 이력 조회
export interface AppointmentHistoryResult {
  scheduleList: AppointmentHistoryItem[];
}

export type AppointmentHistoryResponse = ApiResponse<AppointmentHistoryResult>;

//진료 시작
export interface StartConsultationResult {
  code: string;
}

export type StartConsultationResponse = ApiResponse<StartConsultationResult>;

//진료 이력 상세보기
export interface AppointmentDetail extends AppointmentBase {
  datetime: string;
  symptom: string;
  diagnosis: string;
  guidance: string;
  warning: string;
}

export type AppointmentDetailResponse = ApiResponse<AppointmentDetail>;

export interface FormattedDateTime {
  date: string;
  time: string;
  dayOfWeek: string;
  isToday: boolean;
}
