import { colors } from "@/constants";
import { useCalendarContext } from "@/context/CalendarContext";
import { mockMedicineStore } from "@/data/mockMedicineStore";
import { Medication } from "@/types/medication";
import {
  convertBinaryToTimeSlots,
  convertTimeSlotsToBinary,
} from "@/utils/dateUtils";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useQueryClient } from "@tanstack/react-query";
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
  const queryClient = useQueryClient();
  const { refreshData } = useCalendarContext();

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
  }, [perDay]); // checkedStates.length 제거

  // mockStorage에서 복용 상태 조회하여 체크박스 초기화 (selectedDate 변경 시에만)
  useEffect(() => {
    const loadMedicationStatus = async () => {
      if (!selectedDate) return;

      try {
        // mockStorage에서 약물 정보 조회
        const medication = await mockMedicineStore.getMedication(id);
        if (medication) {
          const takenDates = medication.takenDates || {};
          const dateKey = selectedDate;
          const timeSlot = takenDates[dateKey] || 0;

          console.log(
            `${dateKey} 날짜의 timeSlot: ${timeSlot} (이진수: ${timeSlot.toString(
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
          console.error("약물 정보 조회 실패");
          setCheckedStates(new Array(perDay).fill(false));
        }
      } catch (error) {
        console.error("복용 상태 조회 오류:", error);
        setCheckedStates(new Array(perDay).fill(false));
      }
    };

    // selectedDate가 변경될 때만 상태 초기화
    if (selectedDate) {
      loadMedicationStatus();
    }
  }, [selectedDate, id, perDay]); // selectedDate 변경 시에만 실행

  const handleCheckboxPress = async (index: number) => {
    if (isLoading || !selectedDate) return;

    setIsLoading(true);
    try {
      // 즉시 UI 상태 업데이트
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
        `${selectedDate}: 체크박스 ${index + 1} ${
          newCheckedStates[index] ? "체크" : "해제"
        }, timeSlot=${timeSlot}`
      );

      // mockStorage 업데이트
      const medication = await mockMedicineStore.getMedication(id);
      if (medication) {
        const takenDates = medication.takenDates || {};
        const dateKey = selectedDate;

        console.log(`체크박스: ${selectedDate} → timeSlot: ${timeSlot}`);

        // 해당 날짜의 복용 상태 업데이트
        takenDates[dateKey] = timeSlot;

        await mockMedicineStore.updateMedication(id, {
          takenDates: takenDates,
        });

        // 복용 완료 여부 로그
        const newTakenCount = newCheckedStates.filter(
          (isChecked) => isChecked
        ).length;
        if (newTakenCount === perDay) {
          console.log(`${selectedDate}: 복용 완료! (${perDay}/${perDay})`);
        } else {
          console.log(`${selectedDate}: 미복용 (${newTakenCount}/${perDay})`);
        }

        // React Query 캐시 업데이트
        queryClient.setQueryData(["medications", "list"], (oldData: any) => {
          if (!oldData) return oldData;
          return oldData.map((med: any) =>
            med.id === id
              ? {
                  ...med,
                  takenDates: { ...med.takenDates, [dateKey]: timeSlot },
                }
              : med
          );
        });

        // 캘린더 데이터 새로고침
        queryClient.invalidateQueries({ queryKey: ["medications", "list"] });
        queryClient.invalidateQueries({ queryKey: ["calendarDrugs"] });
      } else {
        Alert.alert("오류", "약물 정보를 찾을 수 없습니다.");
        setCheckedStates([...checkedStates]);
      }
    } catch (error) {
      console.error("복용 상태 업데이트 오류:", error);
      Alert.alert("오류", "복용 상태 업데이트에 실패했습니다.");
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
            style={styles.touchable}
            activeOpacity={0.7}
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
    // gap: 3,
    flexWrap: "wrap",
    width: "80%",
  },
  touchable: {
    padding: 3,
  },
  box: {
    justifyContent: "center",
    alignItems: "center",

    backgroundColor: colors.WHITE,
  },
});
