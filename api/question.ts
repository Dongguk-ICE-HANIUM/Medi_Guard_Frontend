import {
  CreateQuestionRequest,
  GetQuestionResponse,
  questionResponse,
  UpdateQuestionRequest,
} from "@/types/question";
import axiosInstance from "./axios";

async function getQuestion(date: string): Promise<GetQuestionResponse> {
  const { data } = await axiosInstance.get(`/api/question?date=${date}`);

  return data;
}

async function createQuestion(
  body: CreateQuestionRequest
): Promise<questionResponse> {
  const { data } = await axiosInstance.post("/api/calendar", body);

  return data;
}

async function updateQuestion(
  body: UpdateQuestionRequest
): Promise<questionResponse> {
  const { data } = await axiosInstance.patch("/api/question", body);

  return data;
}

export { createQuestion, getQuestion, updateQuestion };
