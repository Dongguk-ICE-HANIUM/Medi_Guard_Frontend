import {
  Drug,
  DrugGroup,
  DrugGroupResponse,
  DrugResponse,
  Medication,
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
  fetchAllDrugs: (date: string) => Promise<void>;
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
    endDate: "2025-09-01",
    timeSlot: 900,
    takenDaysCount: 45,
    missedDaysCount: 5,
  },
  {
    id: "drug-4",
    calendarDrugId: "group-3",
    name: "오메가3",
    startDate: "2025-06-15",
    endDate: "2025-12-15",
    timeSlot: 1900,
    takenDaysCount: 120,
    missedDaysCount: 10,
  },
];

//mock API 함수
const mockDelay = (ms: number = 500) =>
  new Promise((resolve) => setTimeout(resolve, ms));
const mockFetchDrugGroups = async (): Promise<DrugGroupResponse> => {
  await mockDelay();
  return {
    errorCode: null,
    message: "OK",
    result: { drugGroupList: MOCK_DRUG_GROUPS },
  };
};

const mockFetchAllDrugs = async (): Promise<DrugResponse> => {
  await mockDelay();
  return {
    errorCode: null,
    message: "OK",
    result: { drugList: MOCK_ALL_DRUGS },
  };
};

export const MedicaitonProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  //사용자 등록
  const [medications, setMedications] = useState<Medication[]>([]);
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
      console.log("약물 추가: ", medication.name);
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
  const fetchDrugGroups = useCallback(async () => {
    if (loading) return; // 중복 호출 방지

    setLoading(true);
    setError(null);

    try {
      console.log("약물 그룹 데이터 로딩");
      const response = await mockFetchDrugGroups();

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

  const fetchAllDrugs = useCallback(async () => {
    if (loading) return; // 중복 호출 방지

    setLoading(true);
    setError(null);

    try {
      console.log("전체 약물 데이터 로딩...");
      const response = await mockFetchAllDrugs();

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
    fetchDrugGroups,
    fetchAllDrugs,
  };

  return (
    <MedicationContext.Provider value={value}>
      {children}
    </MedicationContext.Provider>
  );
};

export default MedicationContext;

export const useMedication = () => {
  const context = useContext(MedicationContext);
  if (!context) {
    throw new Error("useMedication must be used within MedicationProvider");
  }
  return context;
};
