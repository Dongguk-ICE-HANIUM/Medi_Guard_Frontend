import {
  Medication,
  SelectedMedicineInfo,
  TakingType,
} from "@/types/medication";

// 개발용 선택된 약물 정보
export const DEV_SELECTED_MEDICINE: SelectedMedicineInfo = {
  id: "550e8400-e29b-41d4-a716-446655440001",
  name: "우루사데옥시콜산",
};

// 개발용 완성된 약물 데이터 예시들
export const DEV_MEDICATION_EXAMPLES: Medication[] = [
  // 매일 복용
  {
    id: "550e8400-e29b-41d4-a716-446655440001",
    name: "우루사데옥시콜산 (Ursodeoxycholic acid)",
    startAt: "2025-03-15",
    endAt: "2025-03-24",
    takingType: TakingType.DAILY,
    interval: 1,
    particularDate: [],
    perDay: 3,
    amount: 1.25,
    isActive: true,
    groupName: "봄 진료 처방약",
  },

  // 특정일 간격
  {
    id: "550e8400-e29b-41d4-a716-446655440002",
    name: "타이레놀",
    startAt: "2025-03-10",
    endAt: "2025-03-30",
    takingType: TakingType.SPECIFIC_INTERVAL,
    interval: 3,
    particularDate: [],
    perDay: 2,
    amount: 1.0,
    isActive: true,
    groupName: "감기약",
  },

  // 특정 요일 (월,수,금 = 2+8+32 = 42)
  {
    id: "550e8400-e29b-41d4-a716-446655440003",
    name: "비타민 D",
    startAt: "2025-03-01",
    endAt: "2025-04-30",
    takingType: TakingType.SPECIFIC_DAY,
    interval: 42,
    particularDate: [],
    perDay: 1,
    amount: 2.0,
    isActive: true,
    groupName: "영양제",
  },

  // 특정 날짜
  {
    id: "550e8400-e29b-41d4-a716-446655440004",
    name: "항생제",
    startAt: "2025-03-16",
    endAt: "2025-03-18",
    takingType: TakingType.SPECIFIC_DATE,
    interval: 0,
    particularDate: ["2025-03-16", "2025-03-17", "2025-03-18"],
    perDay: 3,
    amount: 0.5,
    isActive: true,
    groupName: "처방약",
  },
];
