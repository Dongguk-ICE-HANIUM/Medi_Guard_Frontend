import { ApiResponse } from "./api";
import { QuestionType } from "./questioin";

export enum emotionType {
  VERY_HAPPY = "VERY_HAPPY",
  HAPPY = "HAPPY",
  NEUTRAL = "NEUTRAL",
  SAD = "SAD",
  ANGRY = "ANGRY",
}

export interface GetEmotionRequest {
  //request variable
  id: string;
  date: string;
  description: string;
  emotion: emotionType;
  questionType: QuestionType;
}

interface GetEmotionResult {
  emotion: emotionType;
  description: string;
}

export interface CreateEmotionRequest {
  date: string;
  description: string;
  emotion: emotionType;
  questionType: QuestionType;
}

export interface UpdateEmotionRequest {
  calendarId: string;
  description: string;
  emotion: emotionType;
  questionType: QuestionType;
}

export type GetEmotionResponse = ApiResponse<GetEmotionResult>;
export type EmotionResponse = ApiResponse<{}>;
