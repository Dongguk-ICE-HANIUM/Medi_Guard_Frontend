import { Drug, DrugGroup } from "@/types/medication";
import { formatDateSlash } from "@/utils/dateUtils";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";
import {
  medicationKeys,
  useCalendarDrugs,
  useMedicationGroupList,
  useMedicationStatus,
} from "./useMedicationQuery";

export interface useMedicineReturn {
  drugGroups: DrugGroup[];
  individualDrugs: Drug[];

  loading: boolean;
  error: string | null;
  selectedDate: string | null;

  filterByDate: (date: string) => void;
  //추후 다시 확인
  clearFilter: () => void;
  refetch: () => Promise<void>;

  getDrugsForCalendarDate: (date: Date) => Drug[];
  hasDrugsOnDate: (date: string) => boolean;
}

const isDateInRange = (
  selectedDate: string,
  startDate: string,
  endDate: string
): boolean => {
  const selected = new Date(selectedDate);
  const start = new Date(startDate);
  const end = new Date(endDate);

  return selected >= start && selected <= end;
};

const useMedicine = (): useMedicineReturn => {
  const { data: allDrugGroups = [], refetch: refetchDrugGroups } =
    useMedicationGroupList();
  const { data: allDrugs = [], refetch: refetchDrugs } = useCalendarDrugs();
  const { loading, error } = useMedicationStatus();
  const queryClient = useQueryClient();

  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  //선택된 날짜에 해당하는 약물,그룹 필터링
  const filteredDrugs = useMemo(() => {
    if (!selectedDate || allDrugs.length === 0) {
      return allDrugs;
    }
    const filtered = allDrugs.filter((drug) => {
      return isDateInRange(selectedDate, drug.startDate, drug.endDate);
    });

    console.log(
      `${selectedDate}에 해당하는 약물 필터링 결과: ${filtered.length}개`
    );
    return filtered;
  }, [selectedDate, allDrugs]);

  const filteredDrugGroups = useMemo(() => {
    if (filteredDrugs.length === 0) {
      return [];
    }
    const selectedGroupIds = [
      ...new Set(filteredDrugs.map((drug) => drug.calendarDrugId)),
    ];

    const filtered = allDrugGroups.filter((group) =>
      selectedGroupIds.includes(group.id)
    );
    return filtered;
  }, [filteredDrugs, allDrugGroups]);

  //날짜 필터링
  const filterByDate = useCallback((date: string) => {
    setSelectedDate(date);
    console.log(`날짜 필터 적용 : ${date}`);
  }, []);

  // 필터 초기화 (전체 보기)
  const clearFilter = useCallback(() => {
    setSelectedDate(null);
    console.log("날짜 필터 초기화 - 전체 약물 표시");
  }, []);

  // 데이터 새로고침
  const refetch = useCallback(async () => {
    console.log("약물 데이터 새로고침");
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: medicationKeys.groups() }),
      queryClient.invalidateQueries({
        queryKey: medicationKeys.calendarDrugs(),
      }),
    ]);
  }, [queryClient]);

  // Date 객체로 약물 조회
  const getDrugsForCalendarDate = useCallback(
    (date: Date): Drug[] => {
      const dateString = formatDateSlash(date);
      return allDrugs.filter((drug) => {
        return isDateInRange(dateString, drug.startDate, drug.endDate);
      });
    },
    [allDrugs]
  );

  // 특정 날짜에 약물이 있는지 확인
  const hasDrugsOnDate = useCallback(
    (date: string): boolean => {
      return allDrugs.some((drug) => {
        return isDateInRange(date, drug.startDate, drug.endDate);
      });
    },
    [allDrugs]
  );

  return {
    drugGroups: filteredDrugGroups,
    individualDrugs: filteredDrugs,

    loading,
    error: error?.message || null,
    selectedDate,

    filterByDate,
    clearFilter,
    refetch,

    getDrugsForCalendarDate,
    hasDrugsOnDate,
  };
};

export default useMedicine;
