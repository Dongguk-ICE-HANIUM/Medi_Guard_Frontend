import { fetchAllDrugs, fetchDrugGroups } from "@/api/medicine";
import {
  Drug,
  DrugGroup,
  Medication,
  MedicineInfo,
  TakingType,
} from "@/types/medication";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

interface MedicationContextType {
  medications: Medication[];
  addMedication: (medication: Medication) => void;
  updateMedication: (id: string, updates: Partial<Medication>) => void;
  removeMedication: (id: string) => void;

  //mock 데이터
  drugGroups: DrugGroup[];
  allDrugs: Drug[];
  loading: boolean;
  error: string | null;

  fetchDrugGroups: () => Promise<void>;
  fetchAllDrugs: () => Promise<void>;
}

const MedicationContext = createContext<MedicationContextType | null>(null);

//key
const STORAGE_KEY = "medicaitons_local";

// 🎭 Mock 데이터 (서버 API 시뮬레이션)
const MOCK_DRUG_GROUPS: DrugGroup[] = [
  { id: "group-1", name: "봄 진료 처방약" },
  { id: "group-2", name: "겨울 진료 처방약" },
  { id: "group-3", name: "만성질환 처방약" },
];

// Mock MedicineInfo 데이터
const MOCK_MEDICINE_INFO: MedicineInfo[] = [
  {
    id: "medicine-1",
    name: "우루사정",
    code: "N05123",
    effect: "담즙산 분비 촉진, 담석 용해",
    warning: "일반적으로 식후 1정(250mg) 복용...",
    sideEffect: "장기간 복용시 설사, 복통, 메스꺼움 등이 생길 수 있음...",
    interaction:
      "담즙산 결합제, 알루미늄 함유 제산제와 함께 복용시 흡수 저하...",
    deposit_method: "일반적으로 식후 1정(250mg) 복용",
  },
  {
    id: "medicine-2",
    name: "타이레놀",
    code: "N05124",
    effect: "해열, 진통",
    warning: "식후 복용 권장...",
    sideEffect: "위장장애, 알레르기 반응 등이 생길 수 있음...",
    interaction: "항응고제와 함께 복용시 출혈 위험 증가...",
    deposit_method: "식후 1정 복용",
  },
  {
    id: "medicine-3",
    name: "종합비타민",
    code: "N05125",
    effect: "비타민 보충",
    warning: "과다 복용 주의...",
    sideEffect: "소변 색상 변화 등이 생길 수 있음...",
    interaction: "특별한 상호작용 없음...",
    deposit_method: "아침 식후 1정 복용",
  },
  {
    id: "medicine-4",
    name: "오메가3",
    code: "N05126",
    effect: "혈중 중성지방 감소",
    warning: "식후 복용 권장...",
    sideEffect: "트림, 복부 불편감 등이 생길 수 있음...",
    interaction: "항응고제와 함께 복용시 주의...",
    deposit_method: "식후 1정 복용",
  },
];

// Mock Medication 데이터 (새로운 구조)
const MOCK_MEDICATIONS: Medication[] = [
  {
    id: "med-1",
    medicineInfo: MOCK_MEDICINE_INFO[0], // 우루사정
    startAt: "2025-08-10",
    endAt: "2025-08-20",
    takingType: TakingType.DAILY,
    interval: 1,
    particularDate: [],
    perDay: 3,
    amount: 1,
    isActive: true,
    groupName: "봄 진료 처방약",
    notifiTakingList: [
      { id: "notif-1", time: "08:00" },
      { id: "notif-2", time: "15:00" },
      { id: "notif-3", time: "19:00" },
    ],
  },
  {
    id: "med-2",
    medicineInfo: MOCK_MEDICINE_INFO[1], // 타이레놀
    startAt: "2025-08-05",
    endAt: "2025-08-25",
    takingType: TakingType.DAILY,
    interval: 1,
    particularDate: [],
    perDay: 2,
    amount: 1,
    isActive: true,
    groupName: "봄 진료 처방약",
    notifiTakingList: [
      { id: "notif-4", time: "09:00" },
      { id: "notif-5", time: "18:00" },
    ],
  },
  {
    id: "med-3",
    medicineInfo: MOCK_MEDICINE_INFO[2], // 종합비타민
    startAt: "2025-07-01",
    endAt: "2025-08-01",
    takingType: TakingType.DAILY,
    interval: 1,
    particularDate: [],
    perDay: 1,
    amount: 1,
    isActive: true,
    groupName: "겨울 진료 처방약",
    notifiTakingList: [{ id: "notif-6", time: "09:00" }],
  },
  {
    id: "med-4",
    medicineInfo: MOCK_MEDICINE_INFO[3], // 오메가3
    startAt: "2025-06-15",
    endAt: "2025-08-15",
    takingType: TakingType.DAILY,
    interval: 1,
    particularDate: [],
    perDay: 1,
    amount: 1,
    isActive: true,
    groupName: "만성질환 처방약",
    notifiTakingList: [{ id: "notif-7", time: "19:00" }],
  },
];

// 기존 Drug 타입 데이터 (호환성을 위해 유지)
const MOCK_ALL_DRUGS: Drug[] = [
  {
    id: "drug-1",
    calendarDrugId: "group-1",
    name: "우루사정",
    startDate: "2025-08-10",
    endDate: "2025-08-20",
    timeSlot: 800,
    takenDaysCount: 8,
    missedDaysCount: 2,
  },
  {
    id: "drug-2",
    calendarDrugId: "group-1",
    name: "타이레놀",
    startDate: "2025-08-05",
    endDate: "2025-08-25",
    timeSlot: 1200,
    takenDaysCount: 15,
    missedDaysCount: 3,
  },
  {
    id: "drug-3",
    calendarDrugId: "group-2",
    name: "종합비타민",
    startDate: "2025-07-01",
    endDate: "2025-08-01",
    timeSlot: 900,
    takenDaysCount: 45,
    missedDaysCount: 5,
  },
  {
    id: "drug-4",
    calendarDrugId: "group-3",
    name: "오메가3",
    startDate: "2025-06-15",
    endDate: "2025-08-15",
    timeSlot: 1900,
    takenDaysCount: 120,
    missedDaysCount: 10,
  },
];

export const MedicationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  //사용자 등록
  const [medications, setMedications] =
    useState<Medication[]>(MOCK_MEDICATIONS);
  //서버 조회
  const [drugGroups, setDrugGroups] = useState<DrugGroup[]>([]);
  const [allDrugs, setAllDrugs] = useState<Drug[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadLocalMedicaitions();
    fetchDrugGroups();
    fetchAllDrugs();
  }, []);

  //로컬 데이터 저장,로드 (앱 껐다 켜도 유지되게)
  const loadLocalMedicaitions = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parseMedications = JSON.parse(stored);
        setMedications(parseMedications);
        console.log("로컬 약물 로드 : ", parseMedications.length, "개");
      }
    } catch (error) {
      console.warn("로컬 데이터 로드 실패: ", error);
    }
  };

  const saveLocalMedications = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(medications));
      console.log("로컬 약물 저장: ", medications.length, "개");
    } catch (error) {
      console.warn("로컬 데이터 저장 실패: ", error);
    }
  };

  useEffect(() => {
    if (medications.length > 0) {
      saveLocalMedications();
    }
  }, [medications]);

  //로컬 약물 관리 함수
  const addMedication = useCallback((medication: Medication) => {
    setMedications((prev) => {
      console.log("약물 추가: ", medication.medicineInfo.name);
      return [...prev, medication];
    });
  }, []);

  const updateMedication = useCallback(
    (id: string, updates: Partial<Medication>) => {
      setMedications((prev) =>
        prev.map((med) => (med.id === id ? { ...med, ...updates } : med))
      );
      console.log("약물 수정:", id);
    },
    []
  );

  const removeMedication = useCallback((id: string) => {
    setMedications((prev) => prev.filter((med) => med.id !== id));
    console.log("약물 삭제:", id);
  }, []);

  //서버 api 호출 함수
  const fetchDrugGroupsFromAPI = useCallback(async () => {
    if (loading) return; // 중복 호출 방지

    setLoading(true);
    setError(null);

    try {
      console.log("약물 그룹 데이터 로딩");
      const response = await fetchDrugGroups();

      if (response.errorCode === null && response.result) {
        setDrugGroups(response.result.drugGroupList);
        console.log(
          "약물 그룹 로드 완료:",
          response.result.drugGroupList.length,
          "개"
        );
      } else {
        throw new Error(response.message || "약물 그룹 로드 실패");
      }
    } catch (err: any) {
      setError(err.message);
      console.error("❌ 약물 그룹 로드 실패:", err);
    } finally {
      setLoading(false);
    }
  }, [loading]);

  const fetchAllDrugsFromAPI = useCallback(async () => {
    if (loading) return; // 중복 호출 방지

    setLoading(true);
    setError(null);

    try {
      console.log("전체 약물 데이터 로딩...");
      const response = await fetchAllDrugs();

      if (response.errorCode === null && response.result) {
        setAllDrugs(response.result.drugList);
        console.log(
          "✅ 전체 약물 로드 완료:",
          response.result.drugList.length,
          "개"
        );
      } else {
        throw new Error(response.message || "전체 약물 로드 실패");
      }
    } catch (err: any) {
      setError(err.message);
      console.error("❌ 전체 약물 로드 실패:", err);
    } finally {
      setLoading(false);
    }
  }, [loading]);

  const value: MedicationContextType = {
    // 로컬 데이터
    medications,
    addMedication,
    updateMedication,
    removeMedication,

    // 서버 데이터
    drugGroups,
    allDrugs,
    loading,
    error,

    // API 호출
    fetchDrugGroups: fetchDrugGroupsFromAPI,
    fetchAllDrugs: fetchAllDrugsFromAPI,
  };

  return (
    <MedicationContext.Provider value={value}>
      {children}
    </MedicationContext.Provider>
  );
};

export default MedicationContext;

export const useMedicationContext = () => {
  const context = useContext(MedicationContext);
  if (!context) {
    throw new Error("useMedication must be used within MedicationProvider");
  }
  return context;
};
