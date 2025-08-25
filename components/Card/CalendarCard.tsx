import { colors } from "@/constants";
import { CalendarProvider } from "@/context/CalendarContext";
import { useMedicineContext } from "@/context/MedicineContext";
import { Octicons } from "@expo/vector-icons";
import dayjs from "dayjs";
import { router } from "expo-router";
import { useState } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import Button from "../Button";
import Calendar from "../Calendar/Calendar";
import CustomModal from "../CustomModal";
import Tag from "../tag/Tag";

export default function CalendarCard() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isGuideVisible, setIsGuideVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const { medicines } = useMedicineContext();

  const tagDescriptions = [
    { type: "pillMissed", label: "미복용", desc: "약을 먹지 않은 상태" },
    { type: "pillTaken", label: "복용", desc: "약을 복용중인 상태" },
    { type: "sideEffect", label: "부작용", desc: "부작용이 발생한 상태" },
    { type: "pillSchedule", label: "예정", desc: "복용 예정인 상태" },
    { type: "appointment", label: "진료", desc: "병원 진료가 예약된 상태" },
  ];

  const handleCalendarButton = () => {
    if (!selectedDate) return;

    const today = dayjs().format("YYYY-MM-DD");
    const formatted = dayjs(selectedDate).format("YYYY-MM-DD");

    if (dayjs(formatted).isBefore(today))
      router.push(`/calendar/past/${formatted}`);
    else if (dayjs(formatted).isSame(today))
      router.push(`/calendar/today/${formatted}`);
    else router.push(`/calendar/future/${formatted}`);

    setIsModalVisible(false);
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setIsModalVisible(true);
  };

  return (
    <View>
      <CalendarProvider>
        <View style={styles.title}>
          <Text style={styles.titleText}>복용 달력</Text>
          <Octicons
            name="question"
            size={18}
            color="black"
            onPress={() => setIsGuideVisible(true)}
          />
          <CustomModal
            visible={isGuideVisible}
            onClose={() => setIsGuideVisible(false)}
          >
            <View>
              {tagDescriptions.map((tag) => (
                <View
                  key={tag.type}
                  style={{ flexDirection: "row", gap: 5, margin: 5 }}
                >
                  <Tag
                    tagInfo={{ type: tag.type as any, label: tag.label }}
                    size="small"
                  />
                  <Text>{tag.desc}</Text>
                </View>
              ))}
            </View>
            <View style={styles.buttonContainer}>
              <Button
                text="확인"
                size="medium"
                onPress={() => setIsGuideVisible(false)}
              />
            </View>
          </CustomModal>
        </View>
        <View style={styles.calendarParent}>
          <View style={styles.calendar}>
            <Calendar onDateSelect={handleDateSelect} />
            <CustomModal
              visible={isModalVisible}
              onClose={() => setIsModalVisible(false)}
            >
              <Text style={styles.modalDate}>
                {dayjs(selectedDate).format("M월 DD일 dddd")}
              </Text>
              <View style={styles.modalContent}>
                <Text style={styles.modalContentTitle}>복용중인 약물</Text>
                {medicines.map((medicine) => (
                  <View key={medicine.id} style={styles.modalContentMedicine}>
                    <Text style={styles.medicineName}>{medicine.name}</Text>
                    <Text>{medicine.date}</Text>
                  </View>
                ))}
              </View>
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
            </CustomModal>
          </View>
        </View>
      </CalendarProvider>
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
    width: "100%",
    padding: 10,
  },

  modalDate: {
    fontSize: 19,
    fontWeight: "700",
    margin: 5,
    marginBottom: 0,
  },
  modalContent: {
    margin: 5,
    gap: 5,
  },
  modalContentTitle: {
    fontWeight: "700",
    fontSize: 17,
  },
  modalContentMedicine: {
    flexDirection: "row",
    gap: 25,
    paddingVertical: 15,
    marginVertical: 5,
    padding: 5,
    borderRadius: 10,

    borderBottomWidth: 1, // 전체 테두리에 두께 적용
    borderColor: colors.PINK, // 아래쪽만 색상
  },
  medicineName: {
    fontWeight: "500",
    minWidth: 50,
    fontSize: 16,
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
    flexDirection: "row-reverse",
    gap: 5,
  },
});
