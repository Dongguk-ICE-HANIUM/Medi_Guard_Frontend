import { colors } from "@/constants";
import useTodayMedications from "@/hooks/medication/useTodayMedicine";
import { Octicons } from "@expo/vector-icons";
import dayjs from "dayjs";
import { router } from "expo-router";
import { useState } from "react";
import { Dimensions, Modal, StyleSheet, Text, View } from "react-native";
import Button from "../Button";
import Calendar from "../Calendar/Calendar";
import TodayAllMedicineCard from "./TodayAllMedicineCard";

export default function CalendarCard() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // 선택된 날짜의 약물 목록 가져오기
  const selectedDateString = selectedDate?.toISOString().split("T")[0];
  const { scheduledMedications, targetDate } =
    useTodayMedications(selectedDateString);

  const handleCalendarButton = () => {
    const formatted = dayjs().format("YYYY-MM-DD");
    router.push(`/calendar/today/${formatted}`);
    setIsModalVisible(false);
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setIsModalVisible(true);
  };

  return (
    <View>
      <View style={styles.title}>
        <Text style={styles.titleText}>복용 달력</Text>
        <Octicons name="question" size={18} color="black" />
      </View>
      <View style={styles.calendarParent}>
        <View style={styles.calendar}>
          <Calendar onDateSelect={handleDateSelect} />
          <Modal
            visible={isModalVisible}
            presentationStyle="overFullScreen"
            transparent={true}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalDate}>
                  {dayjs(selectedDate).format("M월 DD일 dddd")}
                </Text>

                {/* 약물 목록 */}
                {selectedDate && (
                  <View style={styles.medicineListContainer}>
                    <TodayAllMedicineCard
                      medications={scheduledMedications}
                      selectedDate={selectedDateString}
                      targetDate={targetDate}
                    />
                  </View>
                )}

                <View style={styles.buttonContainer}>
                  <Button
                    text="취소"
                    size="medium"
                    color="gray"
                    onPress={() => setIsModalVisible(false)}
                  />
                  <Button
                    text="달력보기"
                    size="medium"
                    onPress={handleCalendarButton}
                  />
                </View>
              </View>
            </View>
          </Modal>
        </View>
      </View>
    </View>
  );
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  title: {
    alignItems: "center",
    flexDirection: "row",
    gap: 5,
    paddingTop: 10,
    paddingLeft: 20,
  },
  titleText: {
    fontSize: 16,
    fontWeight: "900",
  },
  calendarParent: {
    alignItems: "center",
    justifyContent: "center",
  },
  calendar: {
    width: "95%",
    padding: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.16,
    shadowRadius: 22,

    backgroundColor: colors.WHITE,
    borderRadius: 16,
    width: width * 0.95,
    height: "auto",
    gap: 10,
    padding: 10,
  },
  modalDate: {
    fontSize: 17,
    fontWeight: "700",
    margin: 5,
  },

  medicineItem: {
    flexDirection: "row",
    gap: 5,
    padding: 15,
  },
  selectedMedicine: {
    borderColor: colors.PINK,
    borderWidth: 1,
    borderRadius: 10,
  },

  buttonContainer: {
    flexDirection: "row",
    gap: 5,
  },
  medicineListContainer: {
    maxHeight: 300,
    marginVertical: 10,
  },
});
