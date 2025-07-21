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

export const useCalendar = (initialDate?: Date): useCalendarReturn => {
  const [calendarData, setCalendarData] = useState<DayData[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState<Date>(
    initialDate || new Date()
  );

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
    [formatDate]
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
          label: "복용 예정",
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
