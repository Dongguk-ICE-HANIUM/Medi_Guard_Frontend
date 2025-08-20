import {
  CreateEmotionRequest,
  EmotionResponse,
  GetEmotionRequest,
  GetEmotionResponse,
  UpdateEmotionRequest,
} from "@/types/emotion";
import axiosInstance from "./axios";

async function getEmotion(
  variables: GetEmotionRequest
): Promise<GetEmotionResponse> {
  const { data } = await axiosInstance.get(
    `/api/calendar?date=${variables.date}`
  );

  return data;
}

async function createEmotion(
  body: CreateEmotionRequest
): Promise<EmotionResponse> {
  const { data } = await axiosInstance.post("/api/calendar", body);

  return data;
}

async function updateEmotion(
  body: UpdateEmotionRequest
): Promise<EmotionResponse> {
  const { data } = await axiosInstance.patch(
    `/api/calendar/${body.calendarId}`,
    body
  );
  return data;
}

export { createEmotion, getEmotion, updateEmotion };
