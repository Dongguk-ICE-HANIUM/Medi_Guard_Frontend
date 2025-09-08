import { ApiResponse } from "./api";

export enum emotionType {
  VERY_HAPPY = "VERY_HAPPY",
  HAPPY = "HAPPY",
  NEUTRAL = "NEUTRAL",
  SAD = "SAD",
  ANGRY = "ANGRY",
}

export interface GetEmotionResult {
  calendarId: string;
  emotion: emotionType;
  description: string;
}

export interface CreateEmotionRequest {
  date: string;
  description: string;
  emotion: emotionType;
}

export interface UpdateEmotionRequest {
  calendarId: string;
  description: string;
  emotion: emotionType;
}

export type GetEmotionResponse = ApiResponse<GetEmotionResult>;
export type EmotionResponse = ApiResponse<{}>;
