import { FormattedDateTime } from "@/types/doctor";

//YYYY.MM.DD
export const formatDateDot = (date: Date): string => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}.${month}.${day}`;
};

export const formatDateStringDot = (dateString: string): string => {
  const date = new Date(dateString);
  return formatDateDot(date);
};

//YYYY-MM-DD
export const formatDateSlash = (date: Date): string => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};

//년 월 일
export const formatDateKor = (date: Date): string => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}년 ${month}월 ${day}일`;
};

export const formatDateStringKor = (dateString: string): string => {
  const date = new Date(dateString);
  return formatDateKor(date);
};

//요일을 이진법으로
export const convertDaysToBinary = (selectedDays: string[]): number => {
  let binary = 0;
  const dayMap: Record<string, number> = {
    월: 1,
    화: 2,
    수: 4,
    목: 8,
    금: 16,
    토: 32,
    일: 64,
  };
  selectedDays.forEach((day) => {
    if (dayMap[day]) {
      binary |= dayMap[day];
    }
  });
  return binary;
};

//이진법을 요일로
export const convertBinaryToDays = (binary: number): string[] => {
  const days: string[] = [];
  const dayMap: Record<number, string> = {
    1: "월",
    2: "화",
    4: "수",
    8: "목",
    16: "금",
    32: "토",
    64: "일",
  };
  Object.entries(dayMap).forEach(([key, day]) => {
    if (binary & parseInt(key)) {
      days.push(day);
    }
  });
  return days;
};

// 복용 횟수 배열을 이진법으로 변환
export const convertTimeSlotsToBinary = (timeSlots: number[]): number => {
  let binary = 0;
  timeSlots.forEach((slot) => {
    binary |= 1 << slot;
  });
  return binary;
};

// 이진법을 복용 횟수 배열로 변환
export const convertBinaryToTimeSlots = (binary: number): number[] => {
  const timeSlots: number[] = [];
  let temp = binary;
  let position = 0;

  while (temp > 0) {
    if (temp & 1) {
      timeSlots.push(position);
    }
    temp >>= 1;
    position++;
  }

  return timeSlots;
};

//병원 진료용 날짜 데이터 전송
export const formatAppointmentDate = (isoString: string): FormattedDateTime => {
  const date = new Date(isoString);
  const now = new Date();

  const isToday = date.toDateString() === now.toDateString();

  const dateString = formatDateDot(date);

  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const timeString = `${hours}:${minutes}`;

  const dayNames = ["일", "월", "화", "수", "목", "금", "토"];
  const dayOfWeek = dayNames[date.getDay()];

  return {
    date: dateString,
    time: timeString,
    dayOfWeek,
    isToday,
  };
};

//년.월.일 (요일) 시간 형식
export const formatAppointmentDisplay = (isoString: string): string => {
  const formatted = formatAppointmentDate(isoString);
  return `${formatted.date} (${formatted.dayOfWeek}) ${formatted.time}`;
};

//진료 시작까지 남은 시간 계산
export const getTimeUntilAppointment = (isoString: string): string | null => {
  const appoinmentTime = new Date(isoString);
  const now = new Date();

  if (appoinmentTime <= now) {
    return null;
  }
  const diffMs = appoinmentTime.getTime() - now.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 0) {
    return `${diffDays}일 전`;
  } else if (diffHours > 0) {
    return `${diffHours}시간 전`;
  } else {
    return `${diffMinutes}분 전`;
  }
};
