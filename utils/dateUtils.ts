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
