import { ApiResponse } from "./api";

export enum QuestionType {
  PHYSICAL_SYMPTOMS = "PHYSICAL_SYMPTOMS", // 신체 증상 및 태아 상태
  FETAL_MOVEMENT = "FETAL_MOVEMENT", // 태아 움직임
  MEDICATION_COMPLIANCE = "MEDICATION_COMPLIANCE", // 약물 복용 준수
  MEDICATION_SIDE_EFFECTS = "MEDICATION_SIDE_EFFECTS", // 약물 부작용
  MOOD_STATUS = "MOOD_STATUS", // 기분 상태
  MENTAL_HEALTH = "MENTAL_HEALTH", // 정신 건강
  DAILY_LIFE = "DAILY_LIFE", // 일상생활
  FAMILY_SUPPORT = "FAMILY_SUPPORT", // 가족 지원
  PATIENT_CONCERNS = "PATIENT_CONCERNS", // 환자 우려사항
}

export const randomQuestion: question[] = [
  {
    id: "1",
    type: QuestionType.DAILY_LIFE,
    answer: "일상생활을 하는데 불편함이 있나요?",
  },
  {
    id: "2",
    type: QuestionType.PATIENT_CONCERNS,
    answer: "걱정되는 부분이나 추가적으로 알고 싶은 정보가 있나요?",
  },
  {
    id: "3",
    type: QuestionType.PATIENT_CONCERNS,
    answer: "진료시 담당의사에게 하고 싶은 질문은 무엇일까요?",
  },
  {
    id: "4",
    type: QuestionType.PHYSICAL_SYMPTOMS,
    answer: "몸에 불편한 증상이 있나요?",
  },
  {
    id: "5",
    type: QuestionType.MOOD_STATUS,
    answer: "요즘 기분은 어떠신가요?",
  },
  {
    id: "6",
    type: QuestionType.FETAL_MOVEMENT,
    answer: "태아의 움직임은 어떤가요?",
  },
];

export interface question {
  id: string;
  type: QuestionType;
  answer: string;
}

export interface GetQuestionRequest {
  questionList: question[];
}

interface GetQuestionResult {
  questionList: question[];
}

export type GetQuestionResponse = ApiResponse<GetQuestionResult>;

interface createQuestion {
  type: QuestionType;
  answer: string;
}
export interface CreateQuestionRequest {
  questionList: createQuestion[];
}

export interface UpdateQuestionRequest {
  questionList: question[];
}

export type questionResponse = ApiResponse<{}>;
