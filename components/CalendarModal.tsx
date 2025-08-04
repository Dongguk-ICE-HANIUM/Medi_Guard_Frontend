import { colors } from "@/constants";
import React, { useEffect, useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Calendar } from "react-native-calendars";

interface CalendarModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (startDate: string, endDate: string) => void;
  initialStartDate?: string;
  initialEndDate?: string;
}

const CalendarModal: React.FC<CalendarModalProps> = ({
  visible,
  onClose,
  onConfirm,
  initialStartDate = "",
  initialEndDate = "",
}) => {
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);
  const [isSelectingEnd, setIsSelecteingEnd] = useState(false);

  useEffect(() => {
    if (visible) {
      setStartDate(initialStartDate);
      setEndDate(initialEndDate);
      setIsSelecteingEnd(false);
    }
  }, [visible, initialStartDate, initialEndDate]);

  const handleDayPress = (day: { dateString: string }) => {
    const selectedDate = day.dateString;

    if (!isSelectingEnd) {
      setStartDate(selectedDate);
      setEndDate("");
      setIsSelecteingEnd(true);
      return;
    }

    if (new Date(selectedDate) < new Date(startDate)) {
      setStartDate(selectedDate);
      setEndDate("");
      return;
    }
    setEndDate(selectedDate);
  };

  const getMarked = () => {
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
          textColor: colors.WHITE,
        };
      }
      current.setDate(current.getDate() + 1);
    }
    return markedDates;
  };

  const handleConfirm = () => {
    if (startDate && endDate) {
      onConfirm(startDate, endDate);
    }
  };

  const isConfirmDisabled = !startDate || !endDate;

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.closeButton}>X</Text>
          </TouchableOpacity>
        </View>

        <Calendar
          onDayPress={handleDayPress}
          markedDates={getMarked()}
          markingType="period"
          theme={{
            selectedDayBackgroundColor: colors.PINK + 30,
            arrowColor: colors.PURPLE,
          }}
        />

        <View style={styles.footer}>
          <TouchableOpacity style={styles.cancel} onPress={onClose}>
            <Text>취소</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancel} onPress={onClose}>
            <Text>확인</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default CalendarModal;

const styles = StyleSheet.create({
  overlay: {},
  header: {},
  closeButton: {},
  footer: {},
  cancel: {},
});
