import { colors } from "@/constants";
import { useMedicationContext } from "@/context/MedicationContext";
import { DayData } from "@/types/calendar";
import { TagInfo } from "@/types/tags";
import { useCallback, useEffect, useState } from "react";

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

  for (let day = 1; day <= daysInMonth; day++) {
    const currentDate = new Date(year, month, day);
    const dateString = currentDate.toISOString().split("T")[0];

    // 해당 날짜에 복용해야 하는 약물이 있는지 확인
    const hasScheduledMedication = medications.some((medication) => {
      const startDate = new Date(medication.startAt);
      const endDate = new Date(medication.endAt);
      const currentDateObj = new Date(dateString);

      return currentDateObj >= startDate && currentDateObj <= endDate;
    });

    calendarData.push({
      didTakePill: false,
      hasSideEffect: false,
      isTakeScheduled: hasScheduledMedication,
      isScheduled: false,
    });
  }

  return calendarData;
};

//
//컴포넌트 시작
//
export const useCalendar = (initialDate?: Date): useCalendarReturn => {
  const [calendarData, setCalendarData] = useState<DayData[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState<Date>(
    initialDate || new Date()
  );
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const { medications } = useMedicationContext();

  const fetchCalendarData = useCallback(
    async (date: Date): Promise<void> => {
      setLoading(true);
      setError(null);
      try {
        console.log(
          "달력 데이터 생성 : ",
          date.getFullYear(),
          date.getMonth() + 1,
          "약물 개수:",
          medications.length
        );

        await new Promise((resolve) => setTimeout(resolve, 300));

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
      return calendarData[dayIndex];
    },
    [calendarData]
  );

  const getTagsForDay = useCallback(
    (dayIndex: number): TagInfo[] => {
      const daystatus = getDayStatus(dayIndex);
      if (!daystatus) {
        return [];
      }
      const tags: TagInfo[] = [];

      if (daystatus.didTakePill === true) {
        tags.push({
          type: "pillTaken",
          label: "복용",
          color: colors.BLUE,
        });
      } else if (daystatus.didTakePill === false) {
        tags.push({
          type: "pillMissed",
          label: "미복용",
          color: colors.RED,
        });
      } else {
        tags.push({
          type: "pillSchedule",
          label: "복용 예정",
          color: colors.YELLOW,
        });
      }
      if (daystatus.hasSideEffect) {
        tags.push({
          type: "sideEffect",
          label: "부작용",
          color: colors.PURPLE,
        });
      }
      if (daystatus.isTakeScheduled) {
        tags.push({
          type: "pillSchedule",
          label: "예정",
          color: colors.YELLOW,
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
    [getDayStatus]
  );

  const refreshData = useCallback((): void => {
    fetchCalendarData(currentDate);
  }, [currentDate, fetchCalendarData]);

  useEffect(() => {
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
