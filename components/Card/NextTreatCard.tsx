import { colors } from "@/constants";
import { Octicons } from "@expo/vector-icons";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import { useState } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import CalendarModal, { CalendarMode } from "../CalendarModal";
import CustomModal from "../CustomModal";
import NextTreatItem from "./NextTreatItem";

type TreatItem = {
  date: string;
  hospital: string;
};

export default function NextTreatCard() {
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);

  const [treatItems, setTreatItems] = useState<TreatItem[]>([]);

  const [tempDate, setTempDate] = useState<string>("");
  const [tempHospital, setTempHospital] = useState("");

  const isConfirmDisabled = () => {
    return tempHospital.trim() === "";
  };

  // 날짜선택
  const handleCalendarConfirm = (dates: string[]) => {
    if (dates.length > 0) {
      setTempDate(dates[0]);
      setIsFormVisible(true);
    }
    setIsCalendarVisible(false);
  };
  // 폼 저장
  const handleSave = () => {
    setTreatItems((prev) => [
      ...prev,
      { date: tempDate, hospital: tempHospital },
    ]);

    setTempHospital("");
    setIsFormVisible(false);
  };

  return (
    <View style={styles.nextTreatCard}>
      <View style={styles.title}>
        <Text style={styles.titleText}>다음 진료 일정</Text>
        <Octicons
          name="plus-circle"
          size={18}
          color="black"
          onPress={() => setIsCalendarVisible(true)}
        />

        <CalendarModal // 달력모달
          visible={isCalendarVisible}
          selectionMode={CalendarMode.SPECIFIC}
          onClose={() => setIsCalendarVisible(false)}
          onSpecificConfirm={handleCalendarConfirm}
        />

        <CustomModal
          visible={isFormVisible}
          onClose={() => setIsFormVisible(false)}
        >
          <View style={styles.title}>
            <Text style={styles.titleText}>병원명</Text>
          </View>
          <View style={styles.modalContent}>
            <TextInput
              placeholder="병원명을 입력하세요"
              value={tempHospital}
              onChangeText={setTempHospital}
              style={styles.input}
              placeholderTextColor={colors.TEXT_GRAY}
            />
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setIsFormVisible(false)}
            >
              <Text style={styles.cancelText}>취소</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.confirmButton,
                isConfirmDisabled() && styles.disabledButton,
              ]}
              onPress={handleSave}
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
        </CustomModal>
      </View>

      <View style={styles.nextTreatList}>
        <View style={styles.nextTreatItem}>
          {treatItems.length > 0 ? (
            treatItems.map((item, idx) => (
              <NextTreatItem
                key={idx}
                date={`${dayjs(item.date).format("M월 DD일 dddd")}(${
                  item.hospital
                })`}
              />
            ))
          ) : (
            <Text>등록된 일정이 없습니다.</Text>
          )}
        </View>
      </View>
    </View>
  );
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  nextTreatCard: {},
  title: {
    alignItems: "center",
    flexDirection: "row",
    gap: 5,
    paddingVertical: 7,
    paddingLeft: 20,
  },
  titleText: {
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 5,
  },
  nextTreatList: {
    alignItems: "center",
    justifyContent: "center",
  },
  nextTreatItem: {
    backgroundColor: colors.WHITE,
    borderRadius: 16,
    width: "95%",
    padding: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: colors.WHITE,
    borderRadius: 16,
    width: width * 0.9,
    height: "auto",
    gap: 10,
    padding: 10,
    marginBottom: 10,
  },
  modalDate: {
    fontSize: 17,
    fontWeight: "700",
    margin: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 5,
  },
  input: {
    borderRadius: 10,
    backgroundColor: "#F7F8FA",
    paddingVertical: 12,
    paddingHorizontal: 15,
    fontSize: 13,
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
