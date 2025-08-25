// data/mockMedicineRecognition.ts
import { RecognizedMedicineInfo } from "@/types/medicationReconition";

export const mockRecognizedMedicine: RecognizedMedicineInfo = {
  id: "huons-amoxicla-tab",
  name: "휴온스아목시크라정",
  code: "N0507034",
  effect:
    "아목시실린과 클라불란산 복합 제제로서 베타락타마제를 생성하는 내성균에 대해서도 효과를 나타내며, 광범위 항균 스펙트럼을 가진 항생제입니다.",
  warning: `임산부는 이 약의 순혈 중에 들어간 양이 보고되어 있어 분만시 용량을 제한해야 합니다. 신장기능이 저하된 환자들은 사용하지 말도록 합니다.`,
  sideEffect: `일반적인 부작용으로 설사 또는 연변, 구역, 구토, 가스찬 복통, 과민반응이 나타날 수 있습니다. 때로는 간수치 상승, 혈소판 감소증이 나타날 수 있습니다.`,
  interaction: `와파린과 병용시 혈액응고능 검사인 국제표준화비율(INR)의 변화가 보고되어 있어 주의해야 합니다. 경구용 항응고제와 함께 복용할 경우 혈액응고 시간을 정기적으로 모니터링해야 합니다.`,
  depositMethod:
    "성인 및 12세 이상: 1회 1정, 1일 2회 12시간 간격으로 복용합니다. 식사와 함께 복용하면 위장장애를 줄일 수 있습니다.",
};

// AI 분석 단계별 메시지
export const analysisSteps = [
  { step: 1, message: "이미지를 분석하고 있습니다...", duration: 800 },
  { step: 2, message: "약물 형태를 인식하고 있습니다...", duration: 1000 },
  { step: 3, message: "식별코드를 추출하고 있습니다...", duration: 900 },
  {
    step: 4,
    message: "약물 데이터베이스를 검색하고 있습니다...",
    duration: 700,
  },
  { step: 5, message: "약물 정보를 확인하고 있습니다...", duration: 600 },
];

// 시연용 딜레이 함수
export const mockAnalysisDelay = () => {
  const totalDuration = analysisSteps.reduce(
    (acc, step) => acc + step.duration,
    0
  );
  return new Promise((resolve) => setTimeout(resolve, totalDuration));
};
