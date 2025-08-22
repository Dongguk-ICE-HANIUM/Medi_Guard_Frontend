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
