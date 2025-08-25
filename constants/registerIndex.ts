import { TakingType } from "@/types/medication";

export enum Weekday {
  SUNDAY = 1,
  MONDAY = 2,
  TUESDAY = 4,
  WEDNESDAY = 8,
  THURSDAY = 16,
  FRIDAY = 32,
  SATURDAY = 64,
}

export const WEEKDAY_LABELS = {
  [Weekday.SUNDAY]: "일",
  [Weekday.MONDAY]: "월",
  [Weekday.TUESDAY]: "화",
  [Weekday.WEDNESDAY]: "수",
  [Weekday.THURSDAY]: "목",
  [Weekday.FRIDAY]: "금",
  [Weekday.SATURDAY]: "토",
};

export const TAKING_TYPE_OPTIONS = [
  { label: "매일", value: TakingType.EVERY_DAY },
  { label: "특정일 간격", value: TakingType.PARTICULAR_INTERVAL },
  { label: "특정 요일", value: TakingType.PARTICULAR_DAY },
  { label: "특정 날짜", value: TakingType.SPECIFIC_DATE },
  { label: "필요시 복용", value: TakingType.NEED },
];
