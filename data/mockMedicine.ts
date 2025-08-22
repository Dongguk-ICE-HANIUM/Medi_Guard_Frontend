import { Medication, MedicineInfo, TakingType } from "@/types/medication";

// 개발용 선택된 약물 정보
export const DEV_SELECTED_MEDICINE: MedicineInfo = {
  id: "550e8400-e29b-41d4-a716-446655440001",
  name: "우루사데옥시콜산",
  code: "N05123",
  effect: "담석 용해 및 예방",
  warning: "임신부는 의사와 상담 후 복용",
  sideEffect: "복통, 설사 등이 있을 수 있음",
  interaction: "다른 약물과의 상호작용 가능성",
  deposit_method: "식후 30분에 복용",
};

// 개발용 완성된 약물 데이터 예시들
export const DEV_MEDICATION_EXAMPLES: Medication[] = [
  // 매일 복용
  {
    id: "550e8400-e29b-41d4-a716-446655440001",
    medicineInfo: {
      id: "550e8400-e29b-41d4-a716-446655440001",
      name: "우루사데옥시콜산",
      code: "N05123",
      effect: "담석 용해 및 예방",
      warning: "임신부는 의사와 상담 후 복용",
      sideEffect: "복통, 설사 등이 있을 수 있음",
      interaction: "다른 약물과의 상호작용 가능성",
      deposit_method: "식후 30분에 복용",
    },
    startAt: "2025-03-15",
    endAt: "2025-03-24",
    takingType: TakingType.DAILY,
    interval: 1,
    particularDate: [],
    perDay: 3,
    amount: 1.25,
    isActive: true,
    groupName: "봄 진료 처방약",
    notifiTakingList: [],
  },

  // 특정일 간격
  {
    id: "550e8400-e29b-41d4-a716-446655440002",
    medicineInfo: {
      id: "550e8400-e29b-41d4-a716-446655440002",
      name: "타이레놀",
      code: "N05124",
      effect: "해열, 진통",
      warning: "과다 복용 시 간 손상 위험",
      sideEffect: "메스꺼움, 복통 등",
      interaction: "알코올과 함께 복용 금지",
      deposit_method: "식후 복용",
    },
    startAt: "2025-03-10",
    endAt: "2025-03-30",
    takingType: TakingType.SPECIFIC_INTERVAL,
    interval: 3,
    particularDate: [],
    perDay: 2,
    amount: 1.0,
    isActive: true,
    groupName: "감기약",
    notifiTakingList: [],
  },

  // 특정 요일 (월,수,금 = 2+8+32 = 42)
  {
    id: "550e8400-e29b-41d4-a716-446655440003",
    medicineInfo: {
      id: "550e8400-e29b-41d4-a716-446655440003",
      name: "비타민 D",
      code: "N05125",
      effect: "칼슘 흡수 촉진",
      warning: "과다 복용 시 고칼슘혈증 위험",
      sideEffect: "구토, 설사 등",
      interaction: "다른 비타민과 함께 복용 가능",
      deposit_method: "식후 복용",
    },
    startAt: "2025-03-01",
    endAt: "2025-04-30",
    takingType: TakingType.SPECIFIC_DAY,
    interval: 42,
    particularDate: [],
    perDay: 1,
    amount: 2.0,
    isActive: true,
    groupName: "영양제",
    notifiTakingList: [],
  },

  // 특정 날짜
  {
    id: "550e8400-e29b-41d4-a716-446655440004",
    medicineInfo: {
      id: "550e8400-e29b-41d4-a716-446655440004",
      name: "항생제",
      code: "N05126",
      effect: "세균 감염 치료",
      warning: "완전한 처방 기간 복용 필수",
      sideEffect: "알레르기 반응, 설사 등",
      interaction: "다른 약물과 상호작용 가능",
      deposit_method: "식후 복용",
    },
    startAt: "2025-03-16",
    endAt: "2025-03-18",
    takingType: TakingType.SPECIFIC_DATE,
    interval: 0,
    particularDate: ["2025-03-16", "2025-03-17", "2025-03-18"],
    perDay: 3,
    amount: 0.5,
    isActive: true,
    groupName: "처방약",
    notifiTakingList: [],
  },
];
