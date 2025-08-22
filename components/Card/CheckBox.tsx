import { completeMedication, getMedicationStatus } from "@/api/medicine";
import { colors } from "@/constants";
import { Medication } from "@/types/medication";
import {
  convertBinaryToTimeSlots,
  convertTimeSlotsToBinary,
} from "@/utils/dateUtils";
import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, TouchableOpacity, View } from "react-native";

interface CheckBoxProps {
  medication: Medication;
  selectedDate?: string;
}

const CheckBox = ({ medication, selectedDate }: CheckBoxProps) => {
  const { perDay, id } = medication;
  const [checkedStates, setCheckedStates] = useState<boolean[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // perDay 변경 시 체크박스 개수 업데이트
  useEffect(() => {
    if (checkedStates.length !== perDay) {
      console.log(`perDay 변경 감지: ${checkedStates.length} -> ${perDay}`);

      // 기존 체크 상태를 유지하면서 새로운 개수에 맞게 조정
      const newCheckedStates = new Array(perDay).fill(false);
      const minLength = Math.min(checkedStates.length, perDay);

      for (let i = 0; i < minLength; i++) {
        newCheckedStates[i] = checkedStates[i];
      }

      setCheckedStates(newCheckedStates);
    }
  }, [perDay, checkedStates.length]);

  // 서버에서 복용 상태 조회하여 체크박스 초기화
  useEffect(() => {
    const loadMedicationStatus = async () => {
      if (!selectedDate) return;

      try {
        const response = await getMedicationStatus(id, selectedDate);
        if (response.errorCode === null) {
          const timeSlot = response.result.timeSlot;
          console.log(
            `서버에서 받은 timeSlot: ${timeSlot} (이진수: ${timeSlot.toString(
              2
            )})`
          );

          // timeSlot을 체크박스 상태로 변환
          const timeSlots = convertBinaryToTimeSlots(timeSlot);
          const newCheckedStates = new Array(perDay).fill(false);

          timeSlots.forEach((slot) => {
            if (slot < perDay) {
              newCheckedStates[slot] = true;
            }
          });

          setCheckedStates(newCheckedStates);
          console.log("체크박스 상태 초기화:", newCheckedStates);
        } else {
          console.error("복용 상태 조회 실패:", response.message);
          setCheckedStates(new Array(perDay).fill(false));
        }
      } catch (error) {
        console.error("복용 상태 조회 오류:", error);
        setCheckedStates(new Array(perDay).fill(false));
      }
    };

    loadMedicationStatus();
  }, [id, selectedDate, perDay]);

  const handleCheckboxPress = async (index: number) => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const newCheckedStates = [...checkedStates];
      newCheckedStates[index] = !newCheckedStates[index];
      setCheckedStates(newCheckedStates);

      // timeSlot 계산 (이진수로 변환)
      const checkedTimeSlots: number[] = [];
      newCheckedStates.forEach((isChecked, i) => {
        if (isChecked) {
          checkedTimeSlots.push(i);
        }
      });
      const timeSlot = convertTimeSlotsToBinary(checkedTimeSlots);

      console.log(
        `복용 체크박스 ${index + 1}번째 ${
          newCheckedStates[index] ? "체크" : "해제"
        }, timeSlot: ${timeSlot}`
      );

      // API 호출
      const response = await completeMedication(id, timeSlot);
      if (response.errorCode === null) {
        console.log("복용 완료 API 성공:", response.result);
      } else {
        Alert.alert("오류", "복용 상태 업데이트에 실패했습니다.");
        // 실패 시 원래 상태로 되돌리기
        setCheckedStates([...checkedStates]);
      }
    } catch (error) {
      console.error("복용 완료 API 오류:", error);
      Alert.alert("오류", "복용 상태 업데이트에 실패했습니다.");
      // 실패 시 원래 상태로 되돌리기
      setCheckedStates([...checkedStates]);
    } finally {
      setIsLoading(false);
    }
  };

  const checkboxes = Array.from({ length: perDay }, (_, i) => i);

  return (
    <View style={styles.container}>
      {checkboxes.map((index) => {
        const isChecked = checkedStates[index];
        return (
          <TouchableOpacity
            key={index}
            onPress={() => handleCheckboxPress(index)}
            disabled={isLoading}
          >
            <View style={styles.box}>
              {isChecked ? (
                <Ionicons
                  name="checkbox-outline"
                  size={25}
                  color={colors.PINK}
                />
              ) : (
                <Ionicons
                  name="square-outline"
                  size={25}
                  color={colors.TEXT_GRAY}
                />
              )}
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default CheckBox;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
    width: "80%",
  },
  overbox: {},
  box: {},
});
