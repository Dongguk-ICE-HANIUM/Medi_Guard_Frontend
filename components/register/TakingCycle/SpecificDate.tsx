import CalendarModal, { CalendarMode } from "@/components/CalendarModal";
import { colors } from "@/constants";
import { formatDateStringDot } from "@/utils/dateUtils";
import Feather from "@expo/vector-icons/Feather";
import React, { useMemo, useState } from "react";
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
}

const SpecificDate = ({ dates, onChange, errors }: SpecificDateProps) => {
  const [isModal, setIsModal] = useState(false);
  const sorted = useMemo(
    () => [...dates].sort((a, b) => a.localeCompare(b)),
    [dates]
  );
  const removeDate = (iso: string) => onChange(sorted.filter((d) => d !== iso));
  const handleConfirm = (dates: string[]) => {
    onChange(dates);
    setIsModal(false);
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
        <TouchableOpacity onPress={() => setIsModal(true)}>
          <Text style={styles.addText}>+ 날짜 추가</Text>
        </TouchableOpacity>
      </View>
      <CalendarModal
        visible={isModal}
        selectionMode={CalendarMode.SPECIFIC}
        onClose={() => setIsModal(false)}
        onSpecificConfirm={handleConfirm}
        initialSpecificDates={dates}
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
  chipText: {
    padding: 10,
    fontSize: 15,
  },
  close: {
    marginRight: 8,
    fontSize: 18,
  },
});
