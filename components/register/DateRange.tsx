import { colors } from "@/constants";
import { formatDateStringDot } from "@/utils/dateUtils";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import CalendarModal, { CalendarMode } from "../CalendarModal"; // **수정: CalendarMode import 추가**

export interface DateRangeProps {
  startAt: string;
  endAt: string;
  onStartChange: (date: string) => void;
  onEndChange: (date: string) => void;
  errors?: string[];
  showError?: boolean;
}

const DateRange: React.FC<DateRangeProps> = ({
  startAt,
  endAt,
  onStartChange,
  onEndChange,
  errors = [],
  showError = false,
}) => {
  const [isModal, setIsModal] = useState(false);
  const hasError = showError && errors.length > 0;

  // 캘린더 모달에서 날짜 선택 후 호출
  const handleConfirm = (startDate: string, endDate: string) => {
    onStartChange(startDate);
    onEndChange(endDate);
    setIsModal(false); // 모달 닫기
  };

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.title}>복용 기간</Text>
        <MaterialCommunityIcons
          name="information-outline"
          size={18}
          color="red"
          style={{ marginLeft: 3 }}
        />
        {hasError && (
          <Text
            style={{
              color: colors.RED,
              marginLeft: 5,
              top: -1,
            }}
          >
            {errors.join(", ")}
          </Text>
        )}
      </View>
      <View style={styles.dateContainer}>
        <View style={styles.startContainer}>
          <Text style={styles.start}>Start</Text>
          <Text style={[styles.startDate, !startAt && styles.placeholderText]}>
            {startAt ? formatDateStringDot(startAt) : "시작일을 선택해주세요"}
          </Text>
        </View>
        <View style={styles.endContainer}>
          <Text style={styles.end}>End</Text>
          <Text style={[styles.endDate, !endAt && styles.placeholderText]}>
            {endAt ? formatDateStringDot(endAt) : "종료일 선택해주세요"}
          </Text>
        </View>

        <View style={styles.calendar}>
          <FontAwesome5
            name="calendar-alt"
            size={30}
            color="black"
            onPress={() => setIsModal(true)}
          />
        </View>
      </View>

      <CalendarModal
        visible={isModal}
        selectionMode={CalendarMode.RANGE} // **추가: RANGE 모드 명시**
        onClose={() => setIsModal(false)}
        onConfirm={handleConfirm}
        initialStartDate={startAt}
        initialEndDate={endAt}
      />
    </View>
  );
};

export default DateRange;

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  textContainer: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    paddingBottom: 8,
  },
  dateContainer: {
    borderWidth: 0.5,
    borderColor: colors.TEXT_GRAY,
    borderRadius: 12,
    padding: 15,

    flexDirection: "row",
    width: "100%",
    alignItems: "center",
  },
  startContainer: {
    flex: 4,
  },
  start: {
    color: colors.TEXT_GRAY,
    fontSize: 15,
  },
  startDate: {
    paddingTop: 5,
    fontSize: 19,
    fontWeight: "500",
  },
  placeholderText: {
    color: colors.TEXT_GRAY,
    fontSize: 15,
  },
  endContainer: {
    flex: 4,
  },
  end: {
    color: colors.TEXT_GRAY,
    fontSize: 15,
  },
  endDate: {
    paddingTop: 5,
    fontSize: 19,
    fontWeight: "500",
  },
  calendar: {},
});
