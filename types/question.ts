import { ApiResponse } from "./api";

export enum QuestionType {
  PHYSICAL_SYMPTOMS = "PHYSICAL_SYMPTOMS",
  FETAL_MOVEMENT = "FETAL_MOVEMENT",
  MEDICATION_COMPLIANCE = "MEDICATION_COMPLIANCE",
  MEDICATION_SIDE_EFFECTS = "MEDICATION_SIDE_EFFECTS",
  MOOD_STATUS = "MOOD_STATUS",
  MENTAL_HEALTH = "MENTAL_HEALTH",
  DAILY_LIFE = "DAILY_LIFE",
  FAMILY_SUPPORT = "FAMILY_SUPPORT",
  PATIENT_CONCERNS = "PATIENT_CONCERNS",
}

export const randomQuestion = [
  {
    id: "1",
    type: QuestionType.DAILY_LIFE,
    text: "일상생활을 하는데 불편함이 있나요?",
  },
  {
    id: "2",
    type: QuestionType.PATIENT_CONCERNS,
    text: "걱정되는 부분이나 추가적으로 알고 싶은 정보가 있나요?",
  },
  {
    id: "3",
    type: QuestionType.PATIENT_CONCERNS,
    text: "진료시 담당의사에게 하고 싶은 질문은 무엇일까요?",
  },
  {
    id: "4",
    type: QuestionType.PHYSICAL_SYMPTOMS,
    text: "몸에 불편한 증상이 있나요?",
  },
  {
    id: "5",
    type: QuestionType.MOOD_STATUS,
    text: "요즘 기분은 어떠신가요?",
  },
  {
    id: "6",
    type: QuestionType.FETAL_MOVEMENT,
    text: "태아의 움직임은 어떤가요?",
  },
];

export interface question {
  id: string;
  type: QuestionType;
  answer: string;
}

export interface QuestionTemplate {
  id: string;
  type: QuestionType;
  text: string;
}

export interface Answer {
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
  questionList: createQuestion[];
}

export type questionResponse = ApiResponse<{}>;
