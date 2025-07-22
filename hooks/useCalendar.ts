import calendarApi from "@/api/calendar";
import { colors } from "@/constants";
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
}

//
// 더미 데이터 생성 함수
//
export const generateDummyData = (year: number, month: number): DayData[] => {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const mockData: DayData[] = [];

  for (let day = 1; day <= daysInMonth; day++) {
    // 특별한 날짜들에 미리 정의된 태그 조합
    if (day === 1) {
      // 1일 - 모든 태그 표시
      mockData.push({
        didTakePill: true,
        hasSideEffect: true,
        isTakeScheduled: true,
        isScheduled: true,
      });
    } else if (day === 5) {
      // 5일 - 복용 + 부작용
      mockData.push({
        didTakePill: true,
        hasSideEffect: true,
        isTakeScheduled: false,
        isScheduled: false,
      });
    } else if (day === 10) {
      // 10일 - 복용예정 + 진료
      mockData.push({
        didTakePill: false,
        hasSideEffect: false,
        isTakeScheduled: true,
        isScheduled: true,
      });
    } else if (day === 15) {
      // 15일 - 복용만
      mockData.push({
        didTakePill: true,
        hasSideEffect: false,
        isTakeScheduled: false,
        isScheduled: false,
      });
    } else if (day === 20) {
      // 20일 - 부작용만
      mockData.push({
        didTakePill: false,
        hasSideEffect: true,
        isTakeScheduled: false,
        isScheduled: false,
      });
    } else if (day === 28) {
      // 28일 - 진료만
      mockData.push({
        didTakePill: false,
        hasSideEffect: false,
        isTakeScheduled: false,
        isScheduled: true,
      });
    } else {
      // 나머지 날짜들은 랜덤하게 (일관성을 위해 day를 시드로 사용)
      const seed = day * 137;
      const random1 = (Math.sin(seed) + 1) / 2;
      const random2 = (Math.sin(seed * 2) + 1) / 2;
      const random3 = (Math.sin(seed * 3) + 1) / 2;
      const random4 = (Math.sin(seed * 4) + 1) / 2;

      mockData.push({
        didTakePill: random1 > 0.6, // 60% 확률로 복용
        hasSideEffect: random2 > 0.95, // 10% 확률로 부작용
        isTakeScheduled: random3 > 0.98, // 20% 확률로 복용 예정
        isScheduled: random4 > 0.95, // 5% 확률로 진료 예정
      });
    }
  }

  return mockData;
};

export const useCalendar = (initialDate?: Date): useCalendarReturn => {
  const [calendarData, setCalendarData] = useState<DayData[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState<Date>(
    initialDate || new Date()
  );

  const USE_DUMMY_DATA = __DEV__ || true;

  const formatDate = useCallback((date: Date): string => {
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  }, []);

  const fetchCalendarData = useCallback(
    async (date: Date): Promise<void> => {
      setLoading(true);
      setError(null);
      try {
        if (USE_DUMMY_DATA) {
          //더미 데이터 출력
          console.log(
            "더미 데이터 : ",
            date.getFullYear(),
            date.getMonth() + 1
          );

          await new Promise((resolve) => setTimeout(resolve, 500));

          const year = date.getFullYear();
          const month = date.getMonth();
          const mockData = generateDummyData(year, month);

          setCalendarData(mockData);
          return;
        }
        const formattedDate = formatDate(date);
        const data = await calendarApi.getCalendarData(formattedDate);
        setCalendarData(data);
      } catch (err: any) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";
        setError(errorMessage);
        setCalendarData(null);
      } finally {
        setLoading(false);
      }
    },
    [formatDate, USE_DUMMY_DATA]
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

  return {
    calendarData,
    loading,
    error,
    currentDate,
    changeMonth,
    getDayStatus,
    getTagsForDay,
    refreshData,
    setCurrentDate,
  };
};
