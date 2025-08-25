import { colors } from "@/constants";
import { useMedicationList } from "@/hooks/medication/useMedicationQuery";
import { DayData } from "@/types/calendar";
import { TagInfo } from "@/types/tags";
import { convertBinaryToDays } from "@/utils/dateUtils";
import { useCallback, useEffect, useState } from "react";

// 복용 주기에 따라 해당 날짜에 약을 먹어야 하는지 확인하는 함수
export const checkIfShouldTakeOnDate = (
  medication: any,
  targetDate: Date
): boolean => {
  const startDate = new Date(medication.startAt);
  startDate.setHours(0, 0, 0, 0);

  // 복용 시작일 이전인 경우도 true 반환 (복용 예정으로 표시)
  // if (targetDate < startDate) {
  //   return false;
  // }

  switch (medication.takingType) {
    case "EVERY_DAY":
      return true;
    case "PARTICULAR_INTERVAL":
      if (medication.interval && medication.interval > 0) {
        const daysDiff = Math.floor(
          (targetDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
        );
        return daysDiff % medication.interval === 0;
      }
      return false;
    case "PARTICULAR_DAY":
      if (medication.interval) {
        const selectedDays = convertBinaryToDays(medication.interval);
        const dayOfWeek = targetDate.getDay();

        const dayName = ["일", "월", "화", "수", "목", "금", "토"];
        const currentDayName = dayName[dayOfWeek];
        const shouldTake = selectedDays.includes(currentDayName);
        return shouldTake;
      }
      return false;

    case "SPECIFIC_DATE":
      if (
        medication.specificDateList &&
        medication.specificDateList.length > 0
      ) {
        const targetDateString = targetDate.toISOString().split("T")[0];
        const shouldTake =
          medication.specificDateList.includes(targetDateString);
        return shouldTake;
      }
      return false;
    case "NEED":
      if (medication.isActive) {
        return true;
      } else {
        return false;
      }

    default:
      return false;
  }
};

export interface useCalendarReturn {
  calendarData: DayData[] | null;
  loading: boolean;
  error: string | null;
  currentDate: Date;
  changeMonth: (direction: number) => void;
  getDayStatus: (dayIndex: number) => DayData | null;
  getTagsForDay: (dayIndex: number) => TagInfo[];
  refreshData: () => void;
  setCurrentDate: (date: Date) => void;

  selectedDate: Date | null;
  setSelectedDate: (date: Date) => void;
  getSelectedDate: () => string | null;
}

// 실제 약물 데이터 기반 달력 데이터 생성
export const generateCalendarDataFromMedications = (
  year: number,
  month: number,
  medications: any[]
): DayData[] => {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const calendarData: DayData[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let day = 1; day <= daysInMonth; day++) {
    const currentDate = new Date(year, month, day);
    const dateString = currentDate.toISOString().split("T")[0];
    currentDate.setHours(0, 0, 0, 0);

    // 해당 날짜에 복용해야 하는 약물들 찾기
    const scheduledMedications = medications.filter((medication) => {
      const startDate = new Date(medication.startAt);
      const endDate = new Date(medication.endAt);
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);

      if (currentDate < startDate || currentDate > endDate) {
        return false;
      }
      if (medication.takingType === "NEED") {
        return medication.isActive;
      }

      const shouldTakeToday = checkIfShouldTakeOnDate(medication, currentDate);

      return shouldTakeToday;
    });

    // 과거 날짜인지, 현재 날짜인지, 미래 날짜인지 판단
    const isPastDate = currentDate < today;
    const isCurrentDate = currentDate.getTime() === today.getTime();
    const isFutureDate = currentDate > today;

    let didTakePill = false;
    let isTakeScheduled = false;

    if (scheduledMedications.length > 0) {
      isTakeScheduled = true;

      if (isPastDate || isCurrentDate) {
        // 과거 날짜 또는 현재 날짜: takenDates에서 복용 상태 확인
        let allMedicationsTaken = true;

        for (const medication of scheduledMedications) {
          const takenDates = medication.takenDates || {};
          const dateKey = dateString;

          // timeSlot을 이진수로 변환하여 체크된 개수 확인
          const timeSlot = takenDates[dateKey] || 0;
          const binaryString = timeSlot.toString(2);
          const checkedCount = (binaryString.match(/1/g) || []).length;

          // perDay와 비교하여 복용 완료 여부 판단
          if (checkedCount < medication.perDay) {
            allMedicationsTaken = false;
            // break;
          }
        }

        didTakePill = allMedicationsTaken;
      } else {
        // 미래 날짜 (복용 예정)
        // didTakePill = false;
      }
    }

    calendarData.push({
      didTakePill,
      hasSideEffect: false,
      isTakeScheduled,
      isScheduled: false,
    });
  }

  return calendarData;
};

export const useCalendar = (initialDate?: Date): useCalendarReturn => {
  const [calendarData, setCalendarData] = useState<DayData[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState<Date>(
    initialDate || new Date()
  );
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const { data: medications = [] } = useMedicationList();

  const fetchCalendarData = useCallback(
    async (date: Date): Promise<void> => {
      setLoading(true);
      setError(null);
      try {
        const year = date.getFullYear();
        const month = date.getMonth();
        const calendarData = generateCalendarDataFromMedications(
          year,
          month,
          medications
        );

        setCalendarData(calendarData);
      } catch (err: any) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";
        setError(errorMessage);
        setCalendarData(null);
      } finally {
        setLoading(false);
      }
    },
    [medications]
  );

  // medications 데이터가 변경될 때마다 캘린더 데이터 다시 계산
  useEffect(() => {
    if (medications.length > 0) {
      setLoading(true);
      setError(null);
      try {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const newCalendarData = generateCalendarDataFromMedications(
          year,
          month,
          medications
        );

        setCalendarData(newCalendarData);
      } catch (err: any) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";
        setError(errorMessage);
        setCalendarData(null);
      } finally {
        setLoading(false);
      }
    }
  }, [medications, currentDate]);

  const changeMonth = useCallback((direction: number) => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  }, []);

  const getDayStatus = useCallback(
    (dayIndex: number): DayData | null => {
      if (!calendarData || dayIndex < 0 || dayIndex >= calendarData.length) {
        return null;
      }
      const arrayIndex = dayIndex - 1;
      return calendarData[arrayIndex];
    },
    [calendarData]
  );

  // hooks/useCalendar.ts - getTagsForDay 함수 수정 (중복 제거)

  // hooks/useCalendar.ts - getTagsForDay 함수 디버그 강화

  // hooks/useCalendar.ts - getTagsForDay 함수 최종 수정

  const getTagsForDay = useCallback(
    (dayIndex: number): TagInfo[] => {
      const daystatus = getDayStatus(dayIndex);
      if (!daystatus) {
        return [];
      }
      const tags: TagInfo[] = [];

      // 복용 상태 태그 (우선순위: 복용 > 미복용 > 예정)
      if (daystatus.isTakeScheduled) {
        if (daystatus.didTakePill) {
          tags.push({
            type: "pillTaken",
            label: "복용",
            color: colors.BLUE,
          });
        } else {
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          // ✅ 수정: dayIndex가 이제 실제 날짜이므로 그대로 사용
          const targetDate = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            dayIndex // dayIndex=24 → 8월 24일
          );
          targetDate.setHours(0, 0, 0, 0);

          // ✅ 확인용 로그
          console.log(`✅ 최종 수정된 날짜 계산:
            - dayIndex (실제 날짜): ${dayIndex}
            - targetDate: ${targetDate.toISOString().split("T")[0]}
            - today: ${today.toISOString().split("T")[0]}
            - 일치: ${targetDate.getTime() === today.getTime()}`);

          if (targetDate < today) {
            tags.push({
              type: "pillMissed",
              label: "미복용",
              color: colors.RED,
            });
          } else if (targetDate > today) {
            tags.push({
              type: "pillSchedule",
              label: "예정",
              color: colors.YELLOW,
            });
          } else {
            // 오늘인데 복용하지 않음
            tags.push({
              type: "pillMissed",
              label: "미복용",
              color: colors.RED,
            });
          }
        }
      }

      if (daystatus.hasSideEffect) {
        tags.push({
          type: "sideEffect",
          label: "부작용",
          color: colors.PURPLE,
        });
      }

      if (daystatus.isScheduled) {
        tags.push({
          type: "appointment",
          label: "진료",
          color: colors.PINK,
        });
      }

      return tags;
    },
    [getDayStatus, currentDate]
  );

  const refreshData = useCallback((): void => {
    fetchCalendarData(currentDate);
  }, [currentDate, fetchCalendarData]);

  const getSelectedDate = useCallback((): string | null => {
    if (!selectedDate) return null;

    const year = selectedDate.getFullYear();
    const month = (selectedDate.getMonth() + 1).toString().padStart(2, "0");
    const day = selectedDate.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  }, [selectedDate]);

  return {
    calendarData,
    loading,
    error,
    currentDate,
    selectedDate,
    changeMonth,
    getDayStatus,
    getTagsForDay,
    refreshData,
    setCurrentDate,
    setSelectedDate,
    getSelectedDate,
  };
};
