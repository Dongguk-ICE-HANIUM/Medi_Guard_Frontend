import { mockMedicineStore } from "@/data/mockMedicineStore";
import { Medication } from "@/types/medication";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { medicationKeys } from "./useMedicationQuery";

export const useMedicationTaking = () => {
  const queryClient = useQueryClient();

  const updateTakingStatus = useMutation({
    mutationFn: async ({
      medicationId,
      dateString,
      timeSlotIndex,
      isTaken,
    }: {
      medicationId: string;
      dateString: string;
      timeSlotIndex: number;
      isTaken: boolean;
    }) => {
      console.log(`🔧 복용 상태 업데이트 시작:`, {
        medicationId,
        dateString,
        timeSlotIndex,
        isTaken,
      });

      const medication = await mockMedicineStore.getMedication(medicationId);
      if (!medication) throw new Error("약물을 찾을 수 없습니다");

      const takenDates = medication.takenDates || {};
      const currentValue = takenDates[dateString] || 0;

      let newValue: number;
      if (isTaken) {
        newValue = currentValue | (1 << timeSlotIndex);
      } else {
        newValue = currentValue & ~(1 << timeSlotIndex);
      }

      const updatedMedication: Medication = {
        ...medication,
        takenDates: {
          ...takenDates,
          [dateString]: newValue,
        },
      };

      await mockMedicineStore.updateMedication(medicationId, updatedMedication);

      console.log(`💾 AsyncStorage 업데이트 완료:`, {
        약물: medication.medicineInfo.name,
        날짜: dateString,
        이전값: currentValue,
        새값: newValue,
        이진수: newValue.toString(2),
      });

      return updatedMedication;
    },
    onSuccess: (updatedMedication, variables) => {
      console.log(`🔄 캐시 업데이트 시작`);

      queryClient.setQueryData(
        medicationKeys.lists(),
        (oldData: Medication[] | undefined) => {
          if (!oldData) return [];
          const newData = oldData.map((med) =>
            med.id === updatedMedication.id ? updatedMedication : med
          );
          console.log(`📋 캐시 직접 업데이트 완료`);
          return newData;
        }
      );

      queryClient.invalidateQueries({
        queryKey: medicationKeys.lists(),
        refetchType: "active",
      });

      console.log(`✅ 모든 캐시 업데이트 완료`);
    },
    onError: (error) => {
      console.error("❌ 복용 상태 업데이트 실패:", error);
    },
  });

  const getTakingStatus = (
    medication: Medication,
    dateString: string,
    timeSlotIndex: number
  ): boolean => {
    const takenDates = medication.takenDates || {};
    const value = takenDates[dateString] || 0;
    const isChecked = (value & (1 << timeSlotIndex)) !== 0;

    console.log(`📊 복용 상태 확인:`, {
      약물: medication.medicineInfo.name,
      날짜: dateString,
      시간대: timeSlotIndex,
      값: value,
      이진수: value.toString(2),
      체크됨: isChecked,
    });

    return isChecked;
  };

  const isFullyTaken = (
    medication: Medication,
    dateString: string
  ): boolean => {
    const takenDates = medication.takenDates || {};
    const value = takenDates[dateString] || 0;
    const perDay = medication.perDay > 0 ? medication.perDay : 2;
    const expectedValue = (1 << perDay) - 1;
    const fullyTaken = (value & expectedValue) === expectedValue;

    console.log(`🎯 완전 복용 체크:`, {
      약물: medication.medicineInfo.name,
      날짜: dateString,
      현재값: value,
      필요값: expectedValue,
      하루복용횟수: perDay,
      완전복용: fullyTaken,
    });

    return fullyTaken;
  };

  const areAllMedicationsTaken = (
    medications: Medication[],
    dateString: string
  ): boolean => {
    const result = medications.every((medication) =>
      isFullyTaken(medication, dateString)
    );
    console.log(`🏆 모든 약물 복용 완료 체크:`, {
      날짜: dateString,
      총약물수: medications.length,
      모두완료: result,
    });
    return result;
  };

  return {
    updateTakingStatus,
    getTakingStatus,
    isFullyTaken,
    areAllMedicationsTaken,
    isLoading: updateTakingStatus.isPending,
  };
};
