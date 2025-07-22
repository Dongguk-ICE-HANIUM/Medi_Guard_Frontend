import { colors } from "@/constants";
import { useCalendar } from "@/hooks/useCalendar";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import TagsContainer from "./tag/TagsContainer";

export default function Calendar() {
  const {
    calendarData,
    loading,
    error,
    currentDate,
    changeMonth,
    getDayStatus,
    getTagsForDay,
    refreshData,
    setCurrentDate,
  } = useCalendar();

  const getDaysInMonth = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };
  const getLastDayOfMonth = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDay();
  };

  const getPrevMonthLastDay = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth(), 0).getDate();
  };

  const formatMonthYear = (date: Date): string => {
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월`;
  };

  const renderCalendarDay = (
    day: number,
    dayIndex: number
  ): React.ReactNode => {
    const tags = getTagsForDay(dayIndex);

    const today = new Date();
    const cellDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    const isToday = today.toDateString() === cellDate.toDateString();

    return (
      <TouchableOpacity
        key={day}
        style={[styles.dayContainer, isToday && styles.todayContainer]}
        onPress={() => {
          if (tags.length > 0) {
            Alert.alert(
              `${day}일 정보`,
              tags.map((tag) => tag.label).join(","),
              [{ text: "확인", style: "default" }]
            );
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
      days.push(renderCalendarDay(day, day - 1));
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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="colors.PINK" />
      </View>
    );
  }

  return (
    <>
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
    </>
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

  loadingContainer: {},

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
    minHeight: 40,
    justifyContent: "flex-start",
  },

  dayNumber: {
    fontSize: 17,
    justifyContent: "flex-start",
  },
  todayContainer: {},
  todayCircle: {
    backgroundColor: colors.PINK,
    height: 32,
    width: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    opacity: 0.8,
    lineHeight: 36,
    zIndex: 2,
  },
  todayNumber: {
    zIndex: -1,
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
});
