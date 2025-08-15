import CalendarModal, { CalendarMode } from "@/components/CalendarModal";
import { colors } from "@/constants";
import { formatDateStringDot } from "@/utils/dateUtils";
import Feather from "@expo/vector-icons/Feather";
import React, { useMemo } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export interface SpecificDateProps {
  dates: string[];
  onChange: (date: string[]) => void;
  errors?: string[];
  startAt?: string; // 복용 시작일
  endAt?: string; // 복용 종료일
}

const SpecificDate = ({
  dates,
  onChange,
  errors,
  startAt,
  endAt,
}: SpecificDateProps) => {
  const [isModal, setIsModal] = React.useState(false);

  // **1. 먼저 validDates 정의**
  const validDates = useMemo(() => {
    if (!startAt || !endAt) return dates;

    return dates.filter((date) => {
      const dateObj = new Date(date);
      const startObj = new Date(startAt);
      const endObj = new Date(endAt);
      return dateObj >= startObj && dateObj <= endObj;
    });
  }, [dates, startAt, endAt]);

  // **2. validDates를 사용하여 sorted 정의**
  const sorted = useMemo(
    () => [...validDates].sort((a, b) => a.localeCompare(b)),
    [validDates]
  );

  // **3. validDates가 변경되었을 때 부모에게 알림**
  React.useEffect(() => {
    if (validDates.length !== dates.length) {
      onChange(validDates);
    }
  }, [validDates, dates.length, onChange]);

  const removeDate = (iso: string) =>
    onChange(validDates.filter((d) => d !== iso));

  const handleConfirm = (dates: string[]) => {
    onChange(dates);
    setIsModal(false);
  };

  // 복용 기간이 설정되지 않았을 때 비활성화
  const handleAddDate = () => {
    console.log("handleAddDate - startAt:", startAt);
    console.log("handleAddDate - endAt:", endAt);
    if (!startAt || !endAt) {
      alert("복용 기간을 먼저 설정해주세요.");
      return;
    }
    setIsModal(true);
  };

  return (
    <View style={styles.dateContainer}>
      <FlatList
        data={sorted}
        keyExtractor={(item, idx) => item + idx}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ gap: 8, marginTop: 8 }}
        renderItem={({ item }) => (
          <View style={styles.chip}>
            <Text style={styles.chipText}>{formatDateStringDot(item)}</Text>
            <TouchableOpacity onPress={() => removeDate(item)}>
              <Feather name="x" size={24} color="pink" style={styles.close} />
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={null}
      />
      <View style={styles.addRow}>
        <View style={{ flex: 1 }} />
        <TouchableOpacity
          onPress={handleAddDate}
          // disabled={!startAt || !endAt} // 복용 기간 없으면 비활성화
        >
          <Text
            style={[
              styles.addText,
              // 복용 기간이 없을 때 비활성화 스타일
              (!startAt || !endAt) && styles.disabledText,
            ]}
          >
            + 날짜 추가
          </Text>
        </TouchableOpacity>
      </View>
      <CalendarModal
        visible={isModal}
        selectionMode={CalendarMode.SPECIFIC}
        onClose={() => setIsModal(false)}
        onSpecificConfirm={handleConfirm}
        initialSpecificDates={validDates} // validDates 사용
        minDate={startAt} // 복용 시작일 전달
        maxDate={endAt} // 복용 종료일 전달
      />
    </View>
  );
};

export default SpecificDate;

const styles = StyleSheet.create({
  dateContainer: {
    flexDirection: "column",
    width: "100%",
  },
  addRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  dateText: {},
  addChip: {},
  chip: {
    flexDirection: "row",
    gap: 5,
    borderColor: colors.PINK,
    borderWidth: 0.5,
    alignItems: "center",
    borderRadius: 10,
    width: "100%",
    justifyContent: "space-between",
    paddingHorizontal: 5,
  },
  addText: {
    borderBottomColor: colors.BLACK,
    borderBottomWidth: 0.5,
    lineHeight: 20,
    marginVertical: 10,
  },
  // 비활성화 텍스트 스타일
  disabledText: {
    borderBottomColor: colors.TEXT_GRAY,
    color: colors.TEXT_GRAY,
  },
  chipText: {
    padding: 10,
    fontSize: 15,
  },
  close: {
    marginRight: 8,
    fontSize: 18,
  },
});
