import {
  AppointmentDetailResponse,
  AppointmentHistoryResponse,
  NextAppointmentResponse,
  StartConsultationResponse,
} from "@/types/doctor";

// 오늘/다음 진료 Mock 데이터
export const mockTodayNextAppointment: NextAppointmentResponse = {
  errorCode: null,
  message: "OK",
  result: {
    scheduleId: 1,
    doctorName: "이진우교수",
    hospitalName: "서울대병원",
    time: "2025-09-25T14:00:00",
    isToday: true,
  },
};

// 진료 이력 Mock 데이터
export const mockAppointmentHistory: AppointmentHistoryResponse = {
  errorCode: null,
  message: "OK",
  result: {
    scheduleList: [
      {
        scheduleId: 1,
        doctorName: "이진우교수",
        hospitalName: "서울대병원",
        datetime: "2025-09-25T14:00:00",
      },
      {
        scheduleId: 2,
        doctorName: "김철수교수",
        hospitalName: "서울대병원",
        datetime: "2025-10-02T10:30:00",
      },
      {
        scheduleId: 3,
        doctorName: "박영희교수",
        hospitalName: "서울아산병원",
        datetime: "2025-10-15T16:00:00",
      },
      {
        scheduleId: 4,
        doctorName: "최민수교수",
        hospitalName: "삼성서울병원",
        datetime: "2025-08-15T09:00:00",
      },
      {
        scheduleId: 5,
        doctorName: "정수연교수",
        hospitalName: "세브란스병원",
        datetime: "2025-07-20T15:30:00",
      },
    ],
  },
};

// 진료 시작 Mock 데이터
export const mockStartConsultation: StartConsultationResponse = {
  errorCode: null,
  message: "OK",
  result: {
    code: "356214",
  },
};

// 진료 상세 Mock 데이터들
export const mockAppointmentDetails: {
  [key: number]: AppointmentDetailResponse;
} = {
  1: {
    errorCode: null,
    message: "OK",
    result: {
      scheduleId: 1,
      doctorName: "이진우교수",
      hospitalName: "서울대병원",
      datetime: "2025-09-25T14:00:00",
      symptom: "복통이 있음, 어지러움 동반",
      diagnosis: "태아성장 상태 정상, 철분제 복용 시작 권장",
      guidance:
        "철분제는 다음 주부터 하루 1회 복용하시고, 충분한 수면을 취하시기 바랍니다. 다음 검진까지 체중 변화를 모니터링해주세요.",
      warning: "무리가 되는 운동 금지",
    },
  },
  2: {
    errorCode: null,
    message: "OK",
    result: {
      scheduleId: 2,
      doctorName: "김철수교수",
      hospitalName: "서울대병원",
      datetime: "2025-10-02T10:30:00",
      symptom: "입덧 심화, 식욕부진",
      diagnosis: "임신 초기 정상적인 증상, 영양제 처방",
      guidance:
        "소량씩 자주 섭취하시고, 생강차가 도움이 될 수 있습니다. 수분 섭취를 충분히 해주세요.",
      warning: "탈수 증상 발생 시 즉시 병원 방문",
    },
  },
  3: {
    errorCode: null,
    message: "OK",
    result: {
      scheduleId: 3,
      doctorName: "박영희교수",
      hospitalName: "서울아산병원",
      datetime: "2025-10-15T16:00:00",
      symptom: "요통, 다리 부종",
      diagnosis: "임신 중기 일반적 증상, 압박스타킹 착용 권장",
      guidance:
        "적절한 휴식과 다리 올리기, 가벼운 스트레칭을 권장합니다. 압박스타킹을 착용해보세요.",
      warning: "심한 부종 시 즉시 연락",
    },
  },
  4: {
    errorCode: null,
    message: "OK",
    result: {
      scheduleId: 4,
      doctorName: "최민수교수",
      hospitalName: "삼성서울병원",
      datetime: "2025-08-15T09:00:00",
      symptom: "정기검진",
      diagnosis: "모든 수치 정상, 건강한 임신 진행 중",
      guidance:
        "현재 상태가 매우 좋습니다. 균형잡힌 식단과 적절한 운동을 지속해주세요.",
      warning: "특별한 주의사항 없음",
    },
  },
  5: {
    errorCode: null,
    message: "OK",
    result: {
      scheduleId: 5,
      doctorName: "정수연교수",
      hospitalName: "세브란스병원",
      datetime: "2025-07-20T15:30:00",
      symptom: "첫 방문 상담",
      diagnosis: "임신 확인, 초기 검사 정상",
      guidance:
        "엽산 복용을 시작하시고, 금주, 금연을 철저히 지켜주세요. 정기적인 검진을 받으시기 바랍니다.",
      warning: "알코올, 흡연 절대 금지",
    },
  },
};

// Mock API 서비스 함수들 (나중에 React Query로 대체)
export const mockApiService = {
  getTodayNextAppointment: (): Promise<NextAppointmentResponse> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockTodayNextAppointment), 1000);
    });
  },

  getAppointmentHistory: (): Promise<AppointmentHistoryResponse> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockAppointmentHistory), 1500);
    });
  },

  startConsultation: (
    scheduleId: number
  ): Promise<StartConsultationResponse> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockStartConsultation), 800);
    });
  },

  getAppointmentDetail: (
    scheduleId: number
  ): Promise<AppointmentDetailResponse> => {
    return new Promise((resolve) => {
      const detail = mockAppointmentDetails[scheduleId];
      setTimeout(() => resolve(detail), 1200);
    });
  },
};

// 에러 케이스 Mock (테스트용)
export const mockErrorResponse = {
  errorCode: "SERVER_ERROR",
  message: "서버 오류가 발생했습니다.",
  result: null,
};
