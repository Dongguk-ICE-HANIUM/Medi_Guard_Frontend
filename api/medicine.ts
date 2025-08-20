import { DrugDetailResponse } from "@/types/medication";

// 🎭 Mock 데이터 (서버 API 시뮬레이션)
const MOCK_DRUG_DETAIL: DrugDetailResponse = {
  errorCode: null,
  message: "OK",
  result: {
    id: "drug-1",
    name: "우루사정",
    code: "N05123",
    effect: "담즙산 합성 촉진 및 담즙 분비 촉진, 간세포 보호",
    warning: "일반적으로 식후 1정(250mg) 복용...",
    sideEffect: "장기간 복용시 설사, 복통, 메스꺼움 등이 생길 수 있음...",
    interaction:
      "담즙산 결합제, 알루미늄 함유 제산제와 함께 복용시 흡수 저하...",
    deposit_method: "일반적으로 식후 1정(250mg) 복용",
    startAt: "2025-03-08",
    endAt: "2025-03-10",
    takingType: "DAILY" as any,
    perDay: 3,
    amount: 1.25,
    notifiTakingList: [
      {
        id: "notif-1",
        time: "2025-03-08T08:00:00Z",
      },
      {
        id: "notif-2",
        time: "2025-03-08T12:00:00Z",
      },
      {
        id: "notif-3",
        time: "2025-03-08T18:00:00Z",
      },
    ],
    isActive: true,
    groupName: "봄 진료 처방약",
  },
};

// Mock API 함수
const mockDelay = (ms: number = 500) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const fetchDrugDetail = async (
  id: string
): Promise<DrugDetailResponse> => {
  await mockDelay();
  console.log(`약물 상세 정보 요청: ${id}`);

  // 실제로는 서버에서 해당 ID의 약물 정보를 가져와야 함
  return MOCK_DRUG_DETAIL;
};

export const updateDrugActiveStatus = async (
  id: string,
  isActive: boolean
): Promise<{ errorCode: string | null; message: string }> => {
  await mockDelay();
  console.log(`약물 활성화 상태 변경: ${id} -> ${isActive}`);

  return {
    errorCode: null,
    message: "OK",
  };
};
