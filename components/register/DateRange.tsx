import { colors } from "@/constants";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import CalendarModal from "../CalendarModal";

export interface DateRangeProps {
  startAt: string;
  endAt: string;
  onStartChange: (date: string) => void;
  onEndChange: (date: string) => void;
  errors?: string[];
}

const DateRange: React.FC<DateRangeProps> = ({
  startAt,
  endAt,
  onStartChange,
  onEndChange,
  errors = [],
}) => {
  const [isModal, setIsModal] = useState(false);

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
      </View>
      <View style={styles.dateContainer}>
        <View style={styles.startContainer}>
          <Text style={styles.start}>Start</Text>
          <Text style={styles.startDate}>2025.04.15</Text>
        </View>
        <View style={styles.endContainer}>
          <Text style={styles.end}>End</Text>
          <Text style={styles.endDate}>2025.04.30</Text>
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

      {/* ✅ CalendarModal 연결 */}
      <CalendarModal
        visible={isModal}
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
