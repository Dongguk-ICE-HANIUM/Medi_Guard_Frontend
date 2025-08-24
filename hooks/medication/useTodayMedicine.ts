// hooks/useTodayMedications.ts
import { checkIfShouldTakeOnDate } from "@/hooks/useCalendar";
import { Medication, TakingType } from "@/types/medication";
import { useMemo } from "react";
import { useMedicationList } from "./useMedicationQuery";

export interface TodayMedicationsReturn {
  scheduledMedications: Medication[];
  getTodayScheduledCount: (selectedDate?: string) => number;
  hasMedicationScheduled: (date: Date) => boolean;
}

const useTodayMedications = (selectedDate?: string): TodayMedicationsReturn => {
  const { data: allMedications = [] } = useMedicationList();

  // NEED 타입 완전히 제외한 스케줄된 약물만
  const scheduledMedications = useMemo(() => {
    const targetDateStr =
      selectedDate || new Date().toISOString().split("T")[0];
    const targetDate = new Date(targetDateStr);
    targetDate.setHours(0, 0, 0, 0);

    const filtered = allMedications.filter((medication) => {
      const startDate = new Date(medication.startAt);
      const endDate = new Date(medication.endAt);
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);

      // 복용 기간 내에 있는지 확인
      if (targetDate < startDate || targetDate > endDate) {
        return false;
      }

      // NEED 타입은 오늘 약물 목록에서도 제외
      if (medication.takingType === TakingType.NEED) {
        return false;
      }

      // 복용 주기에 따라 해당 날짜에 실제로 약을 먹는지 확인
      const shouldTakeToday = checkIfShouldTakeOnDate(medication, targetDate);
      return shouldTakeToday;
    });

    return filtered;
  }, [allMedications, selectedDate]);

  // 특정 날짜에 복용 예정 약물 개수
  const getTodayScheduledCount = (dateString?: string): number => {
    const targetDateStr = dateString || new Date().toISOString().split("T")[0];
    const targetDate = new Date(targetDateStr);
    targetDate.setHours(0, 0, 0, 0);

    return allMedications.filter((medication) => {
      const startDate = new Date(medication.startAt);
      const endDate = new Date(medication.endAt);
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);

      if (targetDate < startDate || targetDate > endDate) {
        return false;
      }

      if (medication.takingType === TakingType.NEED) {
        return false;
      }

      return checkIfShouldTakeOnDate(medication, targetDate);
    }).length;
  };

  // 특정 날짜에 복용 예정 약물이 있는지 확인
  const hasMedicationScheduled = (date: Date): boolean => {
    const dateString = date.toISOString().split("T")[0];
    return getTodayScheduledCount(dateString) > 0;
  };

  return {
    scheduledMedications,
    getTodayScheduledCount,
    hasMedicationScheduled,
  };
};

export default useTodayMedications;
