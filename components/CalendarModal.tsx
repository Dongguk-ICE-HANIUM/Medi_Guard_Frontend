import { colors } from "@/constants";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
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

  minDate?: string;
  maxDate?: string;
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
  minDate,
  maxDate,
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
  }, [visible]);

  const isDateInRange = (dateString: string): boolean => {
    if (!minDate || !maxDate) return true;

    const date = new Date(dateString);
    const min = new Date(minDate);
    const max = new Date(maxDate);

    return date >= min && date <= max;
  };

  const showOutOfRangeWarning = () => {
    Alert.alert("날짜 선택 안내", "복용 기간 내에서 날짜를 선택해주세요.", [
      { text: "확인", style: "default" },
    ]);
  };

  const handleDayPress = (day: { dateString: string }) => {
    const selectedDate = day.dateString;

    if (selectionMode === CalendarMode.SPECIFIC) {
      if (!isDateInRange(selectedDate)) {
        showOutOfRangeWarning();
        return;
      }

      setSpecificDates((prev) => {
        if (prev.includes(selectedDate)) {
          return prev.filter((date) => date !== selectedDate);
        } else {
          return [...prev, selectedDate].sort();
        }
      });
    } else {
      if (!isSelectingEnd || (startDate && endDate)) {
        setStartDate(selectedDate);
        setEndDate("");
        setIsSelectingEnd(true);
        return;
      }

      if (new Date(selectedDate) < new Date(startDate)) {
        setStartDate(selectedDate);
        setEndDate("");
        return;
      }
      setEndDate(selectedDate);
    }
  };

  const getMarked = () => {
    if (selectionMode === CalendarMode.SPECIFIC) {
      const specificMarked: Record<string, any> = {};

      if (minDate && maxDate) {
        const current = new Date(minDate);
        const end = new Date(maxDate);

        if (minDate === maxDate) {
          specificMarked[minDate] = {
            customStyles: {
              container: {
                backgroundColor: colors.PINK + "25",
              },
              text: {
                color: colors.BLACK,
              },
            },
          };
        } else {
          while (current <= end) {
            const dateStr = current.toISOString().split("T")[0];
            specificMarked[dateStr] = {
              customStyles: {
                container: {
                  backgroundColor: colors.PINK + "25",
                },
                text: {
                  color: colors.BLACK,
                },
              },
            };
            current.setDate(current.getDate() + 1);
          }
        }
      }

      specificDates.forEach((date) => {
        specificMarked[date] = {
          selected: true,
          selectedColor: colors.PINK,
          selectedTextColor: colors.WHITE,
        };
      });

      return specificMarked;
    }

    // RANGE 모드
    if (!startDate) return {};

    if (!endDate) {
      return {
        [startDate]: {
          selected: true,
          selectedColor: colors.PINK,
          selectedTextColor: colors.WHITE,
        },
      };
    }

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
    return !startDate || !endDate;
  };

  const getMarkingType = ():
    | "period"
    | "multi-period"
    | "custom"
    | undefined => {
    if (selectionMode === CalendarMode.SPECIFIC) {
      return "custom";
    }
    return "period";
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
              selectedDayBackgroundColor: colors.PINK,
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
