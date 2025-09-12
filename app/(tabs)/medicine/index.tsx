import Calendar from "@/components/Calendar/Calendar";
import NavigationCard from "@/components/Card/NavigationCard";
import TodayAllMedicineCard from "@/components/Card/TodayAllMedicineCard";
import { useCalendarContext } from "@/context/CalendarContext";
import {
  useMedicationList,
  useMedicationStatus,
} from "@/hooks/medication/useMedicationQuery";
import useTodayMedications from "@/hooks/medication/useTodayMedicine";
import { formatDateSlash } from "@/utils/dateUtils";
import { AntDesign } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function MedicineScreen() {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentDay = currentDate.getDate();

  const { selectedDate, setSelectedDate } = useCalendarContext();
  const { data: medications = [] } = useMedicationList();
  const { loading, error } = useMedicationStatus();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempSelectedDate, setTempSelectedDate] = useState<Date>(
    selectedDate || currentDate
  );

  const displayDate = selectedDate || currentDate;
  const selectedDateString = displayDate.toISOString().split("T")[0];

  const { scheduledMedications, targetDate, getTodayScheduledCount } =
    useTodayMedications(selectedDateString);

  const displayMonth = displayDate.getMonth() + 1;
  const displayDay = displayDate.getDate();
  const medicationCount = getTodayScheduledCount(selectedDateString);

  // 선택된 날짜에 복용해야 하는 약물 필터링
  // const getMedicationsForSelectedDate = (date: Date) => {
  //   if (!date) return medications;

  //   const selectedDateString = date.toISOString().split("T")[0];

  //   return medications.filter((medication) => {
  //     const startDate = new Date(medication.startAt);
  //     const endDate = new Date(medication.endAt);
  //     const currentDateObj = new Date(selectedDateString);

  //     return currentDateObj >= startDate && currentDateObj <= endDate;
  //   });
  // };

  // const filteredMedications = getMedicationsForSelectedDate(
  //   selectedDate || currentDate
  // );

  // useEffect(() => {
  //   console.log("현재 약물 데이터:", medications);
  //   console.log("선택된 날짜:", selectedDate?.toISOString().split("T")[0]);
  //   console.log("필터링된 약물:", filteredMedications.length, "개");
  // }, [medications, selectedDate, filteredMedications]);

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
              router.push("/medicine/MedicineList");
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
            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
              <AntDesign name="downcircleo" size={17} color="black" />
            </TouchableOpacity>
          </View>
          <View>
            <View style={styles.calendar}>
              <Calendar />
            </View>
            <View style={styles.todayContainer}>
              <TodayAllMedicineCard
                medications={scheduledMedications}
                selectedDate={formatDateSlash(displayDate)}
                targetDate={targetDate}
                loading={loading}
              />
              {error && <Text style={styles.errorText}>{error.message}</Text>}
            </View>
          </View>
        </View>
      </View>

      {/* 날짜 선택 모달 */}
      <Modal
        visible={showDatePicker}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDatePicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>날짜 선택</Text>

            {/* DatePicker를 사용한 날짜 선택 UI */}
            <View style={styles.datePickerContainer}>
              <DateTimePicker
                value={tempSelectedDate}
                mode="date"
                display="spinner"
                locale="ko-KR"
                onChange={(event, selectedDate) => {
                  if (selectedDate) {
                    setTempSelectedDate(selectedDate);
                  }
                }}
                style={styles.datePicker}
              />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setTempSelectedDate(selectedDate || currentDate);
                  setShowDatePicker(false);
                }}
              >
                <Text style={styles.cancelButtonText}>취소</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={() => {
                  setSelectedDate(tempSelectedDate);
                  setShowDatePicker(false);
                }}
              >
                <Text style={styles.confirmButtonText}>확인</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  // 모달 스타일
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    color: "black",
  },
  datePickerContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  datePicker: {
    width: 200,
    height: 200,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 15,
  },
  modalButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    minWidth: 80,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#f0f0f0",
  },
  confirmButton: {
    backgroundColor: "#007AFF",
  },
  cancelButtonText: {
    color: "black",
    fontWeight: "600",
  },
  confirmButtonText: {
    color: "white",
    fontWeight: "600",
  },
});
