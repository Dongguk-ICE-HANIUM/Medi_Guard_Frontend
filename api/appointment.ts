import {
  AppointmentDetailResponse,
  AppointmentHistoryResponse,
  NextAppointmentResponse,
  StartConsultationResponse,
} from "@/types/doctor";

// mock 데이터
const mockNextAppointment: NextAppointmentResponse = {
  errorCode: null,
  message: "OK",
  result: {
    scheduleId: 1,
    doctorName: "이진우교수",
    hospitalName: "서울대병원",
    time: "2025-05-06T14:00:00",
    isToday: true,
  },
};

const mockAppointmentHistory: AppointmentHistoryResponse = {
  errorCode: null,
  message: "OK",
  result: {
    scheduleList: [
      {
        scheduleId: 1,
        doctorName: "이진우교수",
        hospitalName: "서울대병원",
        datetime: "2025-05-06T14:00:00",
      },
      {
        scheduleId: 2,
        doctorName: "김철수교수",
        hospitalName: "서울대병원",
        datetime: "2025-04-27T10:00:00",
      },
      {
        scheduleId: 3,
        doctorName: "박영희교수",
        hospitalName: "서울아산병원",
        datetime: "2025-04-10T10:00:00",
      },
      {
        scheduleId: 4,
        doctorName: "최민수교수",
        hospitalName: "삼성서울병원",
        datetime: "2025-03-30T14:00:00",
      },
    ],
  },
};

const mockStartConsultation: StartConsultationResponse = {
  errorCode: null,
  message: "OK",
  result: {
    code: "356214",
  },
};

const mockAppointmentDetails: { [key: number]: AppointmentDetailResponse } = {
  1: {
    errorCode: null,
    message: "OK",
    result: {
      scheduleId: 1,
      doctorName: "이진우교수",
      hospitalName: "서울대병원",
      datetime: "2025-05-06T14:00:00",
      symptom: "복통이 있음, 어지러움 동반",
      diagnosis: "태아성장 상태 정상, 철분제 복용 시작 권장",
      guidance:
        "철분제는 다음 주부터 하루 1회 복용하시고, 충분한 수면을 취하시기 바랍니다.",
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
      datetime: "2025-04-27T10:00:00",
      symptom: "입덧 심화, 식욕부진",
      diagnosis: "임신 초기 정상적인 증상, 영양제 처방",
      guidance: "소량씩 자주 섭취하시고, 생강차가 도움이 될 수 있습니다.",
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
      datetime: "2025-04-10T10:00:00",
      symptom: "요통, 다리 부종",
      diagnosis: "임신 중기 일반적 증상, 압박스타킹 착용 권장",
      guidance: "적절한 휴식과 다리 올리기, 가벼운 스트레칭을 권장합니다.",
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
      datetime: "2025-03-30T14:00:00",
      symptom: "정기검진",
      diagnosis: "모든 수치 정상, 건강한 임신 진행 중",
      guidance:
        "현재 상태가 매우 좋습니다. 균형잡힌 식단과 적절한 운동을 지속해주세요.",
      warning: "특별한 주의사항 없음",
    },
  },
};

//api 호출
export const mockAppointmentApi = {
  //다음 진료 예정 조회
  getNextAppointment: async (): Promise<NextAppointmentResponse> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockNextAppointment);
      }, 800);
    });
  },
  //진료 이력 조회
  getAppointmentHistory: async (): Promise<AppointmentHistoryResponse> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockAppointmentHistory);
      }, 1000);
    });
  },

  //진료 시작
  startConsultation: (
    scheduleId: number
  ): Promise<StartConsultationResponse> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockStartConsultation);
      }, 600);
    });
  },

  //진료 상세 조회
  getAppointmentDetail: (
    scheduleId: number
  ): Promise<AppointmentDetailResponse> => {
    return new Promise((resolve) => {
      const detail =
        mockAppointmentDetails[scheduleId] || mockAppointmentDetails[1];
      setTimeout(() => resolve(detail), 700);
    });
  },
};
