import { Drug, DrugGroup } from "@/types/calendar";
import { useCallback, useState } from "react";

export interface useMedicineReturn {
  drugGroups: DrugGroup[];
  individualDrugs: Drug[];
  loading: boolean;
  error: string | null;
  fetchMedicineForDate: (date: string) => Promise<void>;
}

//
//dummydata
//
const getAllMedicineData = () => {
  const drugGroupList = [
    {
      id: "UUID",
      name: "봄 진료 처방약",
    },
    {
      id: "UGID",
      name: "겨울 진료 처방약",
    },
  ];

  const drugList = [
    {
      id: "UUID",
      calendarDrugId: "UUID",
      name: "우루사정",
      startDate: "2025-07-25",
      endDate: "2025-07-30",
      timeSlot: 12,
      takenDaysCount: 8,
      missedDaysCount: 5,
    },
    {
      id: "EUID",
      calendarDrugId: "UUID",
      name: "탁센",
      startDate: "2025-07-10",
      endDate: "2025-03-35",
      timeSlot: 12,
      takenDaysCount: 8,
      missedDaysCount: 5,
    },
    {
      id: "UGID",
      calendarDrugId: "UGID",
      name: "타이레놀",
      startDate: "2025-06-30",
      endDate: "2025-07-2",
      timeSlot: 1005,
      takenDaysCount: 7,
      missedDaysCount: 2,
    },
  ];
  return { drugGroupList, drugList };
};

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
  const [drugGroups, setDrugGroups] = useState<DrugGroup[]>([]);
  const [individualDrugs, setIndividualDrugs] = useState<Drug[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMedicineForDate = useCallback(async (selectedDate: string) => {
    setLoading(true);
    setError(null);

    try {
      await new Promise((resolve) => {
        setTimeout(resolve, 300);
      }); //로딩 상태 확인 위해서 넣음

      const { drugGroupList, drugList } = getAllMedicineData();

      const filteredDrugs = drugList.filter((drug) => {
        return isDateInRange(selectedDate, drug.startDate, drug.endDate);
      });

      const getSelectedGroupIds = filteredDrugs
        .map((drug) => drug.calendarDrugId)
        .filter((id) => id);

      const filteredDrugGroups = drugGroupList.filter((group) =>
        getSelectedGroupIds.includes(group.id)
      );

      setDrugGroups(filteredDrugGroups);
      setIndividualDrugs(filteredDrugs);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);
  return {
    drugGroups,
    individualDrugs,
    loading,
    error,
    fetchMedicineForDate,
  };
};

export default useMedicine;
