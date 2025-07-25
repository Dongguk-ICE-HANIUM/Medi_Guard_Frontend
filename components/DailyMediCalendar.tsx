import { useCalendarContext } from "@/context/CalendarContext";
import useMedicine from "@/hooks/useMedicine";
import { AntDesign } from "@expo/vector-icons";
import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Calendar from "./Calendar";
import TodayAllMedicineCard from "./Card/TodayAllMedicineCard";

const DailyMediCalendar = () => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentDay = currentDate.getDate();

  const { getSelectedDate } = useCalendarContext();
  const { drugGroups, individualDrugs, loading, error, fetchMedicineForDate } =
    useMedicine();

  useEffect(() => {
    const datestring = getSelectedDate();
    if (datestring) {
      fetchMedicineForDate(datestring);
    }
  }, [getSelectedDate, fetchMedicineForDate]);

  return (
    <View style={styles.calendarConatainer}>
      <View style={styles.calendarTitleTextContainer}>
        <Text style={styles.calendarTitleText}>
          {currentMonth}월 {currentDay}일
        </Text>
        <AntDesign name="downcircleo" size={17} color="black" />
      </View>
      <View>
        <Calendar />
        <View style={styles.todayContainer}>
          <TodayAllMedicineCard
            drugGroups={drugGroups}
            individualDrugs={individualDrugs}
            selectedDate={getSelectedDate() || undefined}
            loading={loading}
          />
          {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
      </View>
    </View>
  );
};

export default DailyMediCalendar;

const styles = StyleSheet.create({
  calendarConatainer: {
    marginVertical: 15,
  },
  calendarTitleTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    gap: 5,
  },
  calendarTitleText: {
    fontSize: 17,
  },
  todayContainer: {},
  errorText: {},
});
