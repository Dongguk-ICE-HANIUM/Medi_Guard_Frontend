import { colors } from "@/constants";
import { useCalendarContext } from "@/context/CalendarContext";
import useTodayMedications from "@/hooks/medication/useTodayMedicine";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React, { useEffect } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import TagsContainer from "../tag/TagsContainer";

type CalendarProps = {
  onDateSelect?: (date: Date) => void;
};

export default function Calendar({ onDateSelect }: CalendarProps) {
  const {
    calendarData,
    loading: calendarLoading,
    error: calendarError,
    currentDate,
    changeMonth,
    getDayStatus,
    getTagsForDay,
    refreshData,
    setCurrentDate,
    selectedDate,
    setSelectedDate,
  } = useCalendarContext();

  const { hasMedicationScheduled } = useTodayMedications();

  useEffect(() => {
    if (selectedDate) {
      const selectedMonth = selectedDate.getMonth();
      const selectedYear = selectedDate.getFullYear();
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();

      // 선택된 날짜가 현재 표시중인 달과 다를 때만 이동
      if (selectedMonth !== currentMonth || selectedYear !== currentYear) {
        setCurrentDate(new Date(selectedYear, selectedMonth, 1));
      }
    }
  }, [selectedDate]);

  const getDaysInMonth = (date: Date): number =>
    new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

  const getFirstDayOfMonth = (date: Date): number =>
    new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const getLastDayOfMonth = (date: Date): number =>
    new Date(date.getFullYear(), date.getMonth() + 1, 0).getDay();

  const getPrevMonthLastDay = (date: Date): number =>
    new Date(date.getFullYear(), date.getMonth(), 0).getDate();

  const formatMonthYear = (date: Date): string =>
    `${date.getFullYear()}년 ${date.getMonth() + 1}월`;

  const renderCalendarDay = (
    day: number,
    dayIndex: number
  ): React.ReactNode => {
    const tags = getTagsForDay(dayIndex);

    //추가
    const cellDate = new Date();
    cellDate.setFullYear(currentDate.getFullYear());
    cellDate.setMonth(currentDate.getMonth());
    cellDate.setDate(day);
    cellDate.setHours(12, 0, 0, 0);

    const today = new Date();
    today.setHours(12, 0, 0, 0);
    const isToday = today.toDateString() === cellDate.toDateString();
    const isSelectd = selectedDate?.toDateString() === cellDate.toDateString();

    const hasMedication = hasMedicationScheduled(cellDate);

    return (
      <TouchableOpacity
        key={day}
        style={[
          styles.dayContainer,
          isToday && styles.todayContainer,
          isSelectd && styles.selectedContainer,
        ]}
        onPress={() => {
          setSelectedDate(cellDate);

          if (hasMedication) {
            onDateSelect?.(cellDate);
          }
        }}
      >
        {isToday ? (
          <View style={styles.todayCircle}>
            <Text style={[styles.dayNumber, isToday && styles.todayNumber]}>
              {day}
            </Text>
          </View>
        ) : (
          <Text style={[styles.dayNumber, isToday && styles.todayNumber]}>
            {day}
          </Text>
        )}

        <TagsContainer tags={tags} maxTags={2} />
      </TouchableOpacity>
    );
  };

  const renderCalendarGrid = (): React.ReactNode[] => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const prevMonthLastDay = getPrevMonthLastDay(currentDate);
    const days: React.ReactNode[] = [];
    const lastDayInMonth = getLastDayOfMonth(currentDate);

    const numRows = Math.ceil(days.length / 7);
    const ROW_HEIGHT = 48;
    const calendarHeight = numRows * ROW_HEIGHT;

    for (let i = 0; i < firstDay; i++) {
      const prevDate = prevMonthLastDay - firstDay + i;
      days.push(
        <View
          key={`prev-${i}`}
          style={[styles.prevDayContainer, { height: calendarHeight }]}
        >
          <Text style={styles.prevDay}>{prevDate}</Text>
        </View>
      );
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(renderCalendarDay(day, day));
    }

    for (let i = 1; i <= 6 - lastDayInMonth; i++) {
      days.push(
        <View key={`next-${i}`} style={styles.nextDayContainer}>
          <Text style={styles.nextDay}>{i}</Text>
        </View>
      );
    }

    return days;
  };

  if (calendarLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.PINK} />
      </View>
    );
  }

  if (calendarError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          캘린더를 불러오는 중 오류가 발생했습니다.
        </Text>
        <TouchableOpacity onPress={refreshData} style={styles.retryButton}>
          <Text style={styles.retryText}>다시 시도</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => changeMonth(-1)}>
          <MaterialIcons name="navigate-before" size={30} color="black" />
        </TouchableOpacity>
        <Text style={styles.monthYear}>{formatMonthYear(currentDate)}</Text>
        <TouchableOpacity onPress={() => changeMonth(1)}>
          <MaterialIcons name="navigate-next" size={30} color="black" />
        </TouchableOpacity>
      </View>
      <View style={styles.calendarConatiner}>
        <View style={styles.dayOfWeekContainer}>
          {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
            <Text key={day} style={styles.weekDay}>
              {day}
            </Text>
          ))}
        </View>
        <View style={styles.calendarGrid}>{renderCalendarGrid()}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.WHITE,
    borderRadius: 16,
    padding: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 8,
  },
  navButtionText: {},
  monthYear: {
    fontSize: 19,
    lineHeight: 19,
  },
  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  calendarConatiner: { margin: 5 },
  dayOfWeekContainer: {
    flexDirection: "row",
  },
  weekDay: {
    fontSize: 17,
    width: "14.28%",
    textAlign: "center",
    padding: 10,
  },
  dayContainer: {
    width: "14.28%",
    alignItems: "center",
    paddingVertical: 4,
    minHeight: 50,
    justifyContent: "flex-start",
  },
  dayNumber: {
    fontSize: 17,
    justifyContent: "flex-start",
  },
  todayContainer: {},
  todayCircle: {},
  todayNumber: {
    backgroundColor: colors.PINK,
    height: 20,
    width: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    opacity: 0.8,
  },
  selectedContainer: {
    backgroundColor: colors.PINK + "40",
    borderRadius: 8,
  },
  prevDayContainer: {
    width: "14.28%",
    alignItems: "center",
    paddingVertical: 4,
    minHeight: 50,
    justifyContent: "flex-start",
  },
  prevDay: {
    fontSize: 17,
    color: colors.TEXT_GRAY,
  },
  nextDayContainer: {
    width: "14.28%",
    alignItems: "center",
    paddingVertical: 4,
    minHeight: 50,
    justifyContent: "flex-start",
  },
  nextDay: {
    fontSize: 17,
    color: colors.TEXT_GRAY,
  },
  loadingContainer: {},
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 200,
  },
  errorText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 10,
  },
  retryButton: {
    backgroundColor: colors.PINK,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: "white",
    fontSize: 14,
  },
});
