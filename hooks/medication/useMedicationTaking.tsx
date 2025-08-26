import { mockMedicineStore } from "@/data/mockMedicineStore";
import { Medication } from "@/types/medication";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
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

      // 기존 updateMedication 함수 사용 - 등록 로직과 완전 분리
      const updatedMedication = await mockMedicineStore.updateMedication(
        medicationId,
        {
          takenDates: {
            ...takenDates,
            [dateString]: newValue,
          },
        }
      );

      return updatedMedication;
    },
    onSuccess: (updatedMedication) => {
      // updatedMedication이 null이면 캐시 업데이트를 건너뜀
      if (!updatedMedication) {
        console.warn("약물 업데이트 실패: updatedMedication이 null입니다");
        return;
      }

      // 캐시 업데이트만
      queryClient.setQueryData(
        medicationKeys.lists(),
        (oldData: Medication[] | undefined) => {
          if (!oldData) return [];
          return oldData.map((med) =>
            med.id === updatedMedication.id ? updatedMedication : med
          );
        }
      );

      queryClient.invalidateQueries({ queryKey: medicationKeys.lists() });
    },
  });

  const getTakingStatus = (
    medication: Medication,
    dateString: string,
    timeSlotIndex: number
  ): boolean => {
    const takenDates = medication.takenDates || {};
    const value = takenDates[dateString] || 0;
    return (value & (1 << timeSlotIndex)) !== 0;
  };

  const isFullyTaken = useCallback(
    (medication: Medication, dateString: string): boolean => {
      const takenDates = medication.takenDates || {};
      const value = takenDates[dateString] || 0;
      const perDay = medication.perDay > 0 ? medication.perDay : 2;
      const expectedValue = (1 << perDay) - 1;
      return (value & expectedValue) === expectedValue;
    },
    []
  );

  return {
    updateTakingStatus,
    getTakingStatus,
    isFullyTaken,
    isLoading: updateTakingStatus.isPending,
  };
};
