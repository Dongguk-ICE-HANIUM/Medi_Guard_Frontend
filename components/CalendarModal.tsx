import { colors } from "@/constants";
import React, { useEffect, useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Calendar } from "react-native-calendars";

export enum CalendarMode {
  RANGE = "range",
  SPECIFIC = "specific",
}

interface CalendarModalProps {
  visible: boolean;
  selectionMode?: CalendarMode;

  onClose: () => void;
  onConfirm?: (startDate: string, endDate: string) => void;
  initialStartDate?: string;
  initialEndDate?: string;
  onSpecificConfirm?: (dates: string[]) => void;
  initialSpecificDates?: string[];
}

const CalendarModal: React.FC<CalendarModalProps> = ({
  visible,
  selectionMode,
  onClose,
  onConfirm,
  initialStartDate = "",
  initialEndDate = "",
  onSpecificConfirm,
  initialSpecificDates = [],
}) => {
  //for Range
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);
  const [isSelectingEnd, setIsSelectingEnd] = useState(false);

  //for Specific
  const [specificDates, setSpecificDates] =
    useState<string[]>(initialSpecificDates);

  useEffect(() => {
    if (visible) {
      if (selectionMode === CalendarMode.RANGE) {
        setStartDate(initialStartDate);
        setEndDate(initialEndDate);
        setIsSelectingEnd(false);
      } else {
        setSpecificDates(initialSpecificDates);
      }
    }
  }, [visible, initialStartDate, initialEndDate, initialSpecificDates]);

  const handleDayPress = (day: { dateString: string }) => {
    const selectedDate = day.dateString;
    if (selectionMode === CalendarMode.SPECIFIC) {
      setSpecificDates((prev) => {
        if (prev.includes(selectedDate)) {
          return prev.filter((date) => date !== selectedDate);
        } else {
          return [...prev, selectedDate].sort();
        }
      });
    } else {
      if (!isSelectingEnd) {
        console.log("시작일 설정:", selectedDate);
        setStartDate(selectedDate);
        setEndDate("");
        setIsSelectingEnd(true);
        return;
      }

      if (new Date(selectedDate) < new Date(startDate)) {
        console.log("시작일보다 이전 날짜 선택, 시작일 변경:", selectedDate);
        setStartDate(selectedDate);
        setEndDate("");
        return;
      }
      console.log("종료일 설정:", selectedDate);
      setEndDate(selectedDate);
    }
  };

  const getMarked = () => {
    if (selectionMode === CalendarMode.SPECIFIC) {
      const specificMarked: Record<string, any> = {};
      specificDates.forEach((date) => {
        specificMarked[date] = {
          selected: true,
          selectedColor: colors.PINK,
          textColor: colors.WHITE,
        };
      });
      return specificMarked;
    }
    if (!startDate) return {};

    if (!endDate) {
      return {
        [startDate]: {
          selected: true,
          selectedColor: colors.PINK,
          textColor: colors.WHITE,
        },
      };
    }

    //시작, 종료, 범위 모두 표시
    const markedDates: Record<string, any> = {};
    const current = new Date(startDate);
    const end = new Date(endDate);

    while (current <= end) {
      const dateStr = current.toISOString().split("T")[0];

      if (dateStr === startDate) {
        markedDates[dateStr] = {
          startingDay: true,
          color: colors.PINK,
          textColor: colors.WHITE,
        };
      } else if (dateStr === endDate) {
        markedDates[dateStr] = {
          endingDay: true,
          color: colors.PINK,
          textColor: colors.WHITE,
        };
      } else {
        markedDates[dateStr] = {
          color: colors.PINK + "30",
          textColor: colors.BLACK,
        };
      }
      current.setDate(current.getDate() + 1);
    }
    return markedDates;
  };

  const handleConfirm = () => {
    if (selectionMode === CalendarMode.SPECIFIC) {
      if (specificDates.length > 0 && onSpecificConfirm) {
        onSpecificConfirm(specificDates);
      }
    } else {
      if (startDate && endDate && onConfirm) {
        onConfirm(startDate, endDate);
      }
    }
    onClose();
  };

  const isConfirmDisabled = () => {
    if (selectionMode === CalendarMode.SPECIFIC) {
      return specificDates.length === 0;
    }
    !startDate || !endDate;
  };

  const getMarkingType = () => {
    return selectionMode === CalendarMode.SPECIFIC ? undefined : "period";
  };

  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.calendarContainer}>
          <Calendar
            onDayPress={handleDayPress}
            markedDates={getMarked()}
            markingType={getMarkingType()}
            theme={{
              selectedDayBackgroundColor: colors.PINK + "30",
              arrowColor: colors.PINK,
              calendarBackground: colors.WHITE,
              textSectionTitleColor: colors.BLACK,
              selectedDayTextColor: colors.WHITE,
              todayTextColor: colors.PINK,
              dayTextColor: colors.BLACK,
              textDisabledColor: colors.TEXT_GRAY,
              dotColor: colors.PURPLE,
              selectedDotColor: colors.WHITE,
              monthTextColor: colors.BLACK,
              indicatorColor: colors.PINK,
            }}
          />

          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelText}>취소</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.confirmButton,
                isConfirmDisabled() && styles.disabledButton,
              ]}
              onPress={handleConfirm}
              disabled={isConfirmDisabled()}
            >
              <Text
                style={[
                  styles.confirmText,
                  isConfirmDisabled() && styles.disabledText,
                ]}
              >
                확인
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CalendarModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  calendarContainer: {
    backgroundColor: colors.WHITE,
    borderRadius: 15,
    padding: 20,
    width: "90%",
    maxWidth: 400,
    shadowColor: colors.BLACK,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.BLACK,
  },
  closeButton: {
    fontSize: 20,
    color: colors.TEXT_GRAY,
    padding: 5,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
    gap: 10,
  },
  cancelButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.TEXT_GRAY + 90,
    alignItems: "center",
  },
  cancelText: {
    color: colors.TEXT_GRAY,
    fontSize: 16,
    fontWeight: "500",
  },
  confirmButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: colors.PINK,
    alignItems: "center",
  },
  confirmText: {
    color: colors.WHITE,
    fontSize: 16,
    fontWeight: "500",
  },
  disabledButton: {
    backgroundColor: colors.PINK + 90,
  },
  disabledText: {
    color: colors.WHITE,
  },
});
