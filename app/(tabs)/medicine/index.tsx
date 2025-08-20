import Calendar from "@/components/Calendar/Calendar";
import NavigationCard from "@/components/Card/NavigationCard";
import TodayAllMedicineCard from "@/components/Card/TodayAllMedicineCard";
import { useCalendarContext } from "@/context/CalendarContext";
import { useMedicationContext } from "@/context/MedicationContext";
import { formatDateSlash } from "@/utils/dateUtils";
import { AntDesign } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function MedicineScreen() {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentDay = currentDate.getDate();

  const { selectedDate } = useCalendarContext();
  const { medications, loading, error } = useMedicationContext();

  useEffect(() => {
    console.log("현재 약물 데이터:", medications);
  }, [medications]);

  const displayDate = selectedDate || currentDate;
  const displayMonth = displayDate.getMonth() + 1;
  const displayDay = displayDate.getDate();

  return (
    <ScrollView
      style={{ flex: 1 }}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 10 }}
    >
      <View>
        <View style={styles.navCardContainer}>
          <NavigationCard
            text="전체 복용약 보기"
            icon="next"
            onPress={() => {
              router.push("/medicine/medicineList");
            }}
          />
          <NavigationCard
            text="약물 등록하기"
            icon="plus"
            onPress={() => {
              router.push("/medicine/register");
            }}
          />
        </View>
        <View style={styles.calendarConatainer}>
          <View style={styles.calendarTitleTextContainer}>
            <Text style={styles.calendarTitleText}>
              {displayMonth}월 {displayDay}일
            </Text>
            <AntDesign name="downcircleo" size={17} color="black" />
          </View>
          <View>
            <View style={styles.calendar}>
              <Calendar />
            </View>
            <View style={styles.todayContainer}>
              <TodayAllMedicineCard
                medications={medications}
                selectedDate={formatDateSlash(displayDate)}
                loading={loading}
              />
              {error && <Text style={styles.errorText}>{error}</Text>}
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  navCardContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
  },
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
  calendar: {
    marginBottom: 10,
  },
  todayContainer: {},
  errorText: {},
});
