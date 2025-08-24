import { colors } from "@/constants";
import { useMedicationList } from "@/hooks/useMedicationQuery";
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

      return currentDate >= startDate && currentDate <= endDate;
    });

    // 과거 날짜인지, 현재 날짜인지, 미래 날짜인지 판단
    const isPastDate = currentDate < today;
    const isCurrentDate = currentDate.getTime() === today.getTime();
    const isFutureDate = currentDate > today;

    let didTakePill = false;
    let isTakeScheduled = false;

    if (scheduledMedications.length > 0) {
      isTakeScheduled = true;

      if (isPastDate) {
        // 과거 날짜: 모든 약물을 복용했는지 확인 (임시 계산. 서버에서 가져오기)
        const totalDoses = scheduledMedications.reduce(
          (total, med) => total + med.perDay,
          0
        );
        const takenDoses = Math.floor(totalDoses * 0.8); // 임시로 80% 복용으로 가정
        didTakePill = takenDoses >= totalDoses;
      } else if (isCurrentDate) {
        // 현재 날짜 (아직 복용하지 않음)
        didTakePill = false;
      } else {
        // 미래 날짜 (복용 예정)
        didTakePill = false;
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

      // 복용 상태 태그 (우선순위: 복용 > 미복용 > 예정)
      if (daystatus.isTakeScheduled) {
        if (daystatus.didTakePill) {
          tags.push({
            type: "pillTaken",
            label: "복용",
            color: colors.BLUE,
          });
        } else {
          // 과거 날짜이면서 복용x => 미복용, 미래 날짜=> 예정
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const currentDate = new Date();
          currentDate.setDate(dayIndex + 1);
          currentDate.setHours(0, 0, 0, 0);

          if (currentDate < today) {
            tags.push({
              type: "pillMissed",
              label: "미복용",
              color: colors.RED,
            });
          } else if (currentDate > today) {
            tags.push({
              type: "pillSchedule",
              label: "예정",
              color: colors.YELLOW,
            });
          } else {
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
