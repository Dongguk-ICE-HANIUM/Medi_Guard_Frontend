import {
  DrugDetail,
  DrugDetailResponse,
  DrugGroupResponse,
  DrugResponse,
  TakingType,
} from "@/types/medication";

//  Mock 데이터 (서버 API 시뮬레이션)

// 약물 그룹 데이터
const MOCK_DRUG_GROUPS = [
  { id: "group-1", name: "봄 진료 처방약" },
  { id: "group-2", name: "겨울 진료 처방약" },
  { id: "group-3", name: "만성질환 처방약" },
];

// 전체 약물 목록 데이터  (CalendarDrug 타입)
const MOCK_ALL_DRUGS = [
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

// 약물 상세 정보 데이터
const MOCK_DRUG_DETAILS = {
  "med-1": {
    id: "med-1",
    name: "우루사정",
    code: "N05123",
    effect: "담즙산 합성 촉진 및 담즙 분비 촉진, 간세포 보호",
    warning: "일반적으로 식후 1정(250mg) 복용",
    sideEffect: "장기간 복용시 설사, 복통, 메스꺼움 등이 생길 수 있음",
    interaction: "담즙산 결합제, 알루미늄 함유 제산제와 함께 복용시 흡수 저하",
    deposit_method: "일반적으로 식후 1정(250mg) 복용",
    startAt: "2025-08-10",
    endAt: "2025-08-20",
    takingType: TakingType.DAILY,
    perDay: 3,
    amount: 1,
    notifiTakingList: [
      { id: "notif-1", time: "08:00" },
      { id: "notif-2", time: "15:00" },
      { id: "notif-3", time: "19:00" },
    ],
    isActive: true,
    groupName: "봄 진료 처방약",
    groupId: "group-1",
  },
  "med-2": {
    id: "med-2",
    name: "타이레놀",
    code: "N05124",
    effect: "해열, 진통",
    warning: "식후 복용 권장",
    sideEffect: "위장장애, 알레르기 반응 등이 생길 수 있음",
    interaction: "항응고제와 함께 복용시 출혈 위험 증가",
    deposit_method: "식후 1정 복용",
    startAt: "2025-08-05",
    endAt: "2025-08-25",
    takingType: TakingType.DAILY,
    perDay: 2,
    amount: 1,
    notifiTakingList: [
      { id: "notif-4", time: "09:00" },
      { id: "notif-5", time: "18:00" },
    ],
    isActive: true,
    groupName: "봄 진료 처방약",
    groupId: "group-1",
  },
  "med-3": {
    id: "med-3",
    name: "종합비타민",
    code: "N05125",
    effect: "비타민 보충",
    warning: "과다 복용 주의",
    sideEffect: "소변 색상 변화 등이 생길 수 있음",
    interaction: "특별한 상호작용 없음",
    deposit_method: "아침 식후 1정 복용",
    startAt: "2025-07-01",
    endAt: "2025-08-01",
    takingType: TakingType.DAILY,
    perDay: 1,
    amount: 1,
    notifiTakingList: [{ id: "notif-6", time: "09:00" }],
    isActive: true,
    groupName: "겨울 진료 처방약",
    groupId: "group-2",
  },
  "med-4": {
    id: "med-4",
    name: "오메가3",
    code: "N05126",
    effect: "혈중 중성지방 감소",
    warning: "식후 복용 권장",
    sideEffect:
      "오메가3를 과량 섭취하면 속쓰림, 메스꺼움, 설사와 같은 위장장애가 생길 수 있습니다. 또한 혈액 응고가 지연되어 멍이 잘 들거나 코피, 잇몸 출혈 위험이 높아질 수 있습니다. 드물지만 알레르기 반응이나 면역 관련 이상 증상이 나타날 가능성도 보고되었습니다.",
    interaction:
      "오메가3는 항응고제(와파린)나 항혈소판제(아스피린)와 함께 복용 시 출혈 위험을 크게 높일 수 있습니다. 혈압을 낮추는 약물과 병용하면 저혈압이 심해져 어지럼증이나 피로가 나타날 수 있습니다. 따라서 다른 약을 복용 중이라면 반드시 의사나 약사와 상담 후 섭취하는 것이 안전합니다.",
    deposit_method: "식후 1정 복용",
    startAt: "2025-06-15",
    endAt: "2025-08-25",
    takingType: TakingType.DAILY,
    perDay: 1,
    amount: 1,
    notifiTakingList: [{ id: "notif-7", time: "19:00" }],
    isActive: true,
    groupName: "",
    groupId: "",
  },
  "med-5": {
    id: "med-5",
    name: "아스피린",
    code: "N05127",
    effect: "혈전 예방, 진통, 해열",
    warning: "식후 복용 권장",
    sideEffect: "위장장애, 출혈 위험 증가 등이 생길 수 있음",
    interaction: "항응고제와 함께 복용시 출혈 위험 증가",
    deposit_method: "식후 1정 복용",
    startAt: "2025-01-01",
    endAt: "2025-02-01",
    takingType: TakingType.DAILY,
    perDay: 1,
    amount: 1,
    notifiTakingList: [{ id: "notif-8", time: "09:00" }],
    isActive: true,
    groupName: "겨울 진료 처방약",
    groupId: "group-2",
  },
  "med-6": {
    id: "med-6",
    name: "비타민D",
    code: "N05128",
    effect: "칼슘 흡수 촉진, 뼈 건강",
    warning: "과다 복용 주의",
    sideEffect: "과다 복용시 고칼슘혈증 등이 생길 수 있음",
    interaction: "특별한 상호작용 없음",
    deposit_method: "아침 식후 1정 복용",
    startAt: "2025-01-01",
    endAt: "2025-02-01",
    takingType: TakingType.DAILY,
    perDay: 1,
    amount: 1,
    notifiTakingList: [{ id: "notif-9", time: "09:00" }],
    isActive: true,
    groupName: "겨울 진료 처방약",
    groupId: "group-2",
  },
};

// Mock API 함수
const mockDelay = (ms: number = 500) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// 약물 그룹 목록 조회
export const fetchDrugGroups = async (): Promise<DrugGroupResponse> => {
  await mockDelay();
  console.log("약물 그룹 데이터 로딩");

  return {
    errorCode: null,
    message: "OK",
    result: { drugGroupList: MOCK_DRUG_GROUPS },
  };
};

// 전체 약물 목록 조회
export const fetchAllDrugs = async (): Promise<DrugResponse> => {
  await mockDelay();
  console.log("전체 약물 데이터 로딩");

  return {
    errorCode: null,
    message: "OK",
    result: { drugList: MOCK_ALL_DRUGS },
  };
};

// 약물 상세 정보 조회
export const fetchDrugDetail = async (
  id: string
): Promise<DrugDetailResponse> => {
  await mockDelay();
  console.log(`약물 상세 정보 요청: ${id}`);

  const drugDetail = MOCK_DRUG_DETAILS[id as keyof typeof MOCK_DRUG_DETAILS];

  if (!drugDetail) {
    return {
      errorCode: "NOT_FOUND",
      message: "약물을 찾을 수 없습니다.",
      result: null,
    };
  }

  return {
    errorCode: null,
    message: "OK",
    result: drugDetail,
  };
};

export const updateDrugActiveStatus = async (
  id: string,
  isActive: boolean
): Promise<{ errorCode: string | null; message: string }> => {
  await mockDelay();
  console.log(`약물 활성화 상태 변경: ${id} -> ${isActive}`);

  // Mock 데이터 업데이트
  const drugDetail = MOCK_DRUG_DETAILS[id as keyof typeof MOCK_DRUG_DETAILS];
  if (drugDetail) {
    drugDetail.isActive = isActive;
    console.log("약물 활성화 상태 업데이트 완료:", drugDetail.isActive);
  }

  return {
    errorCode: null,
    message: "OK",
  };
};

// 약물 정보 업데이트
export const updateDrugDetail = async (
  id: string,
  updatedData: Partial<DrugDetail>
): Promise<{ errorCode: string | null; message: string }> => {
  await mockDelay();
  console.log(`약물 정보 업데이트 요청: ${id}`, updatedData);

  // Mock 데이터에서 업데이트
  const drugDetail = MOCK_DRUG_DETAILS[id as keyof typeof MOCK_DRUG_DETAILS];
  if (drugDetail) {
    Object.assign(drugDetail, updatedData);
    console.log("약물 정보 업데이트 완료:", drugDetail);
  }

  return {
    errorCode: null,
    message: "OK",
  };
};

// 그룹에서 약물 해제
export const removeDrugFromGroup = async (
  drugId: string
): Promise<{ errorCode: string | null; message: string; result: {} }> => {
  await mockDelay();
  console.log(`그룹에서 약물 해제 요청: ${drugId}`);

  // Mock 데이터에서 해당 약물 찾아서 그룹명 제거
  const drugDetail =
    MOCK_DRUG_DETAILS[drugId as keyof typeof MOCK_DRUG_DETAILS];
  if (drugDetail) {
    drugDetail.groupName = "";
    drugDetail.groupId = "";
    console.log("그룹에서 약물 해제 완료:", drugDetail);
  }

  return {
    errorCode: null,
    message: "OK",
    result: {},
  };
};

// 그룹 삭제 (그룹과 그룹에 속한 모든 약물 삭제)
export const deleteGroup = async (
  groupId: string
): Promise<{ errorCode: string | null; message: string; result: {} }> => {
  await mockDelay();
  console.log(`그룹 삭제 요청: ${groupId}`);

  // Mock 데이터에서 해당 그룹에 속한 모든 약물 찾아서 삭제
  Object.keys(MOCK_DRUG_DETAILS).forEach((key) => {
    const drugDetail = MOCK_DRUG_DETAILS[key as keyof typeof MOCK_DRUG_DETAILS];
    if (drugDetail && drugDetail.groupId === groupId) {
      // 약물을 완전히 삭제하거나 비활성화
      drugDetail.isActive = false;
      drugDetail.groupName = "";
      drugDetail.groupId = "";
      console.log(`그룹에 속한 약물 비활성화: ${drugDetail.name}`);
    }
  });

  return {
    errorCode: null,
    message: "OK",
    result: {},
  };
};

// 복용 완료 API
export const completeMedication = async (
  drugId: string,
  timeSlot: number
): Promise<{
  errorCode: string | null;
  message: string;
  result: { timeSlot: number };
}> => {
  await mockDelay();
  console.log(`복용 완료 요청: ${drugId}, timeSlot: ${timeSlot}`);

  // Mock 데이터에서 복용 상태 업데이트
  const drugDetail =
    MOCK_DRUG_DETAILS[drugId as keyof typeof MOCK_DRUG_DETAILS];
  if (drugDetail) {
    // timeSlot을 이진수로 변환하여 복용 상태 업데이트
    const binaryTimeSlot = timeSlot
      .toString(2)
      .padStart(drugDetail.perDay, "0");
    console.log("복용 완료 상태 업데이트:", binaryTimeSlot);
  }

  return {
    errorCode: null,
    message: "OK",
    result: { timeSlot },
  };
};

// 특정 날짜의 복용 상태 조회 API
export const getMedicationStatus = async (
  drugId: string,
  date: string
): Promise<{
  errorCode: string | null;
  message: string;
  result: { timeSlot: number };
}> => {
  await mockDelay();
  console.log(`복용 상태 조회: ${drugId}, 날짜: ${date}`);

  // Mock 데이터에서 해당 날짜의 복용 상태 반환
  const drugDetail =
    MOCK_DRUG_DETAILS[drugId as keyof typeof MOCK_DRUG_DETAILS];
  if (drugDetail) {
    // 임시로 랜덤한 timeSlot 반환 (서버에서 해당 날짜 데이터 조회하는 걸로 변경해야 함)
    const randomTimeSlot = Math.floor(
      Math.random() * Math.pow(2, drugDetail.perDay)
    );
    console.log("복용 상태 조회 결과:", randomTimeSlot);

    return {
      errorCode: null,
      message: "OK",
      result: { timeSlot: randomTimeSlot },
    };
  }

  return {
    errorCode: "NOT_FOUND",
    message: "약물을 찾을 수 없습니다.",
    result: { timeSlot: 0 },
  };
};
