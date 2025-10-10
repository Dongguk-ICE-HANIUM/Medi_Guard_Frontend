import { colors } from "@/constants";
import { CalendarProvider } from "@/context/CalendarContext";
import { useMedicineContext } from "@/context/MedicineContext";
import { Octicons } from "@expo/vector-icons";
import dayjs from "dayjs";
import { router } from "expo-router";
import { useState } from "react";
import {
  Dimensions,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Calendar from "../Calendar/Calendar";
import CalendarCheckbox, { Status } from "../CalendarCheckbox";
import CustomModal from "../CustomModal";
import Tag from "../tag/Tag";

export default function CalendarCard() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isGuideVisible, setIsGuideVisible] = useState(false);
  const [status, setStatus] = useState<Status>("taking");
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
      router.push(`/my/calendar/past/${formatted}`);
    else if (dayjs(formatted).isSame(today))
      router.push(`/my/calendar/today/${formatted}`);
    else router.push(`/my/calendar/future/${formatted}`);

    setIsModalVisible(false);
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setIsModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <CalendarProvider>
        <View style={styles.header}>
          <Text style={styles.titleText}>복용 달력</Text>
          <Pressable
            style={styles.helpButton}
            onPress={() => setIsGuideVisible(true)}
            hitSlop={8}
          >
            <Octicons name="question" size={18} color="#8E8E93" />
          </Pressable>

          <CustomModal
            visible={isGuideVisible}
            onClose={() => setIsGuideVisible(false)}
          >
            <View style={styles.guideModal}>
              <Text style={styles.guideTitle}>상태 안내</Text>
              <View style={styles.guideContent}>
                {tagDescriptions.map((tag) => (
                  <View key={tag.type} style={styles.guideItem}>
                    <Tag
                      tagInfo={{ type: tag.type as any, label: tag.label }}
                      size="small"
                    />
                    <Text style={styles.guideDescription}>{tag.desc}</Text>
                  </View>
                ))}
              </View>
              <View style={styles.guideButtonContainer}>
                <Pressable
                  style={styles.confirmButton}
                  onPress={() => setIsGuideVisible(false)}
                >
                  <Text style={styles.confirmButtonText}>확인</Text>
                </Pressable>
              </View>
            </View>
          </CustomModal>
        </View>

        <View style={styles.calendarContainer}>
          <Calendar onDateSelect={handleDateSelect} />

          <CustomModal
            visible={isModalVisible}
            onClose={() => setIsModalVisible(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalDate}>
                  {dayjs(selectedDate).format("M월 DD일 dddd")}
                </Text>
              </View>

              <View style={styles.modalContent}>
                <Text style={styles.modalSectionTitle}>복용중인 약물</Text>
                <View style={styles.medicineList}>
                  {medicines.map((medicine, index) => (
                    <View
                      key={medicine.id}
                      style={[
                        styles.medicineItem,
                        index !== medicines.length - 1 &&
                          styles.medicineItemBorder,
                      ]}
                    >
                      <View style={styles.medicineInfo}>
                        <Text style={styles.medicineName}>{medicine.name}</Text>
                        <Text style={styles.medicineDate}>{medicine.date}</Text>
                      </View>
                      <CalendarCheckbox status={status} onChange={setStatus} />
                    </View>
                  ))}
                </View>
              </View>

              <View style={styles.modalButtonContainer}>
                <Pressable
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setIsModalVisible(false)}
                >
                  <Text style={styles.cancelButtonText}>취소</Text>
                </Pressable>
                <Pressable
                  style={[styles.modalButton, styles.primaryButton]}
                  onPress={handleCalendarButton}
                >
                  <Text style={styles.primaryButtonText}>달력보기</Text>
                </Pressable>
              </View>
            </View>
          </CustomModal>
        </View>
      </CalendarProvider>
    </View>
  );
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F2F2F7",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },

  titleText: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1C1C1E",
    letterSpacing: -0.4,
  },

  helpButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },

  calendarContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },

  guideModal: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    minWidth: 280,
  },

  guideTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1C1C1E",
    marginBottom: 20,
    textAlign: "center",
  },

  guideContent: {
    marginBottom: 24,
  },

  guideItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    gap: 12,
  },

  guideDescription: {
    fontSize: 15,
    color: "#3C3C43",
    flex: 1,
  },

  guideButtonContainer: {
    alignItems: "center",
  },

  confirmButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 120,
  },

  confirmButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },

  // Main Modal Styles
  modalContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    overflow: "hidden",
    minWidth: 320,
    maxWidth: width - 40,
  },

  modalHeader: {
    backgroundColor: "#F2F2F7",
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },

  modalDate: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1C1C1E",
    textAlign: "center",
    letterSpacing: -0.4,
  },

  modalContent: {
    padding: 24,
  },

  modalSectionTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#1C1C1E",
    marginBottom: 16,
  },

  medicineList: {
    backgroundColor: "#F2F2F7",
    borderRadius: 12,
    overflow: "hidden",
  },

  medicineItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
  },

  medicineItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },

  medicineInfo: {
    flex: 1,
  },

  medicineName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1C1C1E",
    marginBottom: 4,
  },

  medicineDate: {
    fontSize: 13,
    color: "#8E8E93",
  },

  modalButtonContainer: {
    flexDirection: "row",
    padding: 16,
    gap: 12,
    backgroundColor: "#F2F2F7",
  },

  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },

  cancelButton: {
    backgroundColor: "#E5E5EA",
  },

  cancelButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1C1C1E",
  },

  primaryButton: {
    backgroundColor: colors.PINK,
  },

  primaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
